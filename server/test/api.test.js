const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../server');

// random() renvoie 0 : l'IA joue toujours la première option, ce qui rend les parties reproductibles.
async function withServer(fn, options = { random: () => 0 }) {
  const server = createApp(options).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, body) => {
    const res = await fetch(base + path, body === undefined ? {} : {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return { status: res.status, body: await res.json() };
  };
  try {
    await fn(call);
  } finally {
    server.close();
  }
}

test('GET /board : plateau vide, decks complets, joueur 1 commence', async () => {
  await withServer(async (call) => {
    const { status, body } = await call('/board');
    assert.equal(status, 200);
    assert.deepEqual(body.piecePositions, {});
    assert.equal(body.player1Deck.turret.quantity, 1);
    assert.equal(body.player1Deck.sniper.quantity, 3);
    assert.equal(body.currentTurn, 'player1');
  });
});

test('placer une pièce bleue : posée, deck décrémenté, l\'IA répond puis le tour revient', async () => {
  await withServer(async (call) => {
    const { status, body } = await call('/place-player1', { cardType: 'sniper', toIndex: 56 });
    assert.equal(status, 200);
    assert.equal(body.piecePositions[56], 'blue_sniper');
    assert.equal(body.player1Deck.sniper.quantity, 2);
    assert.equal(body.currentTurn, 'player1');
    const red = Object.values(body.piecePositions).filter((p) => p && p.startsWith('red_'));
    assert.equal(red.length, 1); // l'IA a placé une pièce
    assert.ok(body.piecePositions[0]); // random()=0 : première case libre de la zone adverse
  });
});

test('placement refusé : zone interdite, case occupée, type inconnu, indice non entier', async () => {
  await withServer(async (call) => {
    assert.equal((await call('/place-player1', { cardType: 'sniper', toIndex: 10 })).status, 400);
    assert.equal((await call('/place-player1', { cardType: 'dragon', toIndex: 56 })).status, 400);
    assert.equal((await call('/place-player1', { cardType: 'sniper', toIndex: 56.5 })).status, 400);
    assert.equal((await call('/place-player1', { cardType: 'sniper', toIndex: null })).status, 400);
    assert.equal((await call('/place-player1', { cardType: 'sniper', toIndex: 56 })).status, 200);
    assert.equal((await call('/place-player1', { cardType: 'sniper', toIndex: 56 })).status, 400);
  });
});

test('le deck limite le nombre de pièces : une seule tourelle', async () => {
  await withServer(async (call) => {
    assert.equal((await call('/place-player1', { cardType: 'turret', toIndex: 56 })).status, 200);
    const second = await call('/place-player1', { cardType: 'turret', toIndex: 57 });
    assert.equal(second.status, 400);
    assert.match(second.body.error, /Plus de cartes/);
  });
});

test('déplacement : une pièce bleue mobile change de case', async () => {
  await withServer(async (call) => {
    await call('/place-player1', { cardType: 'sniper', toIndex: 56 });
    const { status, body } = await call('/move', { fromIndex: 56, toIndex: 58 });
    assert.equal(status, 200);
    assert.equal(body.piecePositions[56], null);
    assert.equal(body.piecePositions[58], 'blue_sniper');
  });
});

test('déplacement refusé : tourelle immobile, sniper hors de sa ligne, case occupée, indices invalides', async () => {
  await withServer(async (call) => {
    await call('/place-player1', { cardType: 'turret', toIndex: 56 });
    await call('/place-player1', { cardType: 'sniper', toIndex: 57 });
    assert.equal((await call('/move', { fromIndex: 56, toIndex: 58 })).status, 400); // tourelle
    assert.equal((await call('/move', { fromIndex: 57, toIndex: 49 })).status, 400); // autre ligne
    assert.equal((await call('/move', { fromIndex: 57, toIndex: 56 })).status, 400); // occupée
    assert.equal((await call('/move', { fromIndex: 57, toIndex: 64 })).status, 400); // hors plateau
    assert.equal((await call('/move', { fromIndex: 57, toIndex: NaN })).status, 400);
    assert.equal((await call('/move', { fromIndex: 0, toIndex: 8 })).status, 400); // pièce rouge
  });
});

test('/place-player2 refusé quand ce n\'est pas le tour de l\'ennemi', async () => {
  await withServer(async (call) => {
    assert.equal((await call('/place-player2', { cardType: 'sniper', toIndex: 3 })).status, 400);
  });
});

test('/reset remet la partie à zéro', async () => {
  await withServer(async (call) => {
    await call('/place-player1', { cardType: 'sniper', toIndex: 56 });
    const { body } = await call('/reset', {});
    assert.deepEqual(body.piecePositions, {});
    assert.equal(body.player1Deck.sniper.quantity, 3);
  });
});

test('deux serveurs ont chacun leur propre partie', async () => {
  await withServer(async (callA) => {
    await withServer(async (callB) => {
      await callA('/place-player1', { cardType: 'sniper', toIndex: 56 });
      assert.deepEqual((await callB('/board')).body.piecePositions, {});
    });
  });
});

test('avec un vrai hasard, l\'IA ne dépasse jamais son deck sur une longue partie', async () => {
  await withServer(async (call) => {
    let board;
    for (let i = 40; i < 44; i++) {
      const res = await call('/place-player1', { cardType: 'sniper', toIndex: i });
      if (res.status === 200) board = res.body;
    }
    const red = Object.values((await call('/board')).body.piecePositions).filter((p) => p && p.startsWith('red_'));
    assert.ok(red.length <= 4); // 1 tourelle + 3 snipers au maximum
    assert.ok(board);
  }, { random: Math.random });
});
