import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

// The proxy is transpiled to CommonJS for this isolated test harness.
const loadModule = createRequire(import.meta.url);
const { NextRequest, NextResponse } = loadModule('next/server');
const {
  unstable_doesMiddlewareMatch,
  getRewrittenUrl,
  isRewrite,
} = loadModule('next/experimental/testing/server');

function loadProxy() {
  let localeCalls = 0;
  const source = readFileSync(new URL('../src/proxy.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const loaded = { exports: {} };
  vm.runInNewContext(compiled, {
    exports: loaded.exports,
    URL,
    require(specifier) {
      if (specifier === 'next-intl/middleware') {
        return () => () => {
          localeCalls += 1;
          return NextResponse.next();
        };
      }
      if (specifier === './i18n/routing') return { routing: {} };
      if (specifier === './config-global') {
        return { getRealtimeApiOrigin: () => 'https://api.example.com' };
      }
      return loadModule(specifier);
    },
  }, { filename: 'proxy.js' });
  return { ...loaded.exports, localeCalls: () => localeCalls };
}

test('all hub paths match, including dotted names and negotiate endpoints', () => {
  const { config } = loadProxy();
  for (const pathname of [
    '/hubs/notifications',
    '/hubs/notifications/negotiate',
    '/hubs/orders.v2',
    '/hubs/orders.v2/negotiate',
  ]) {
    assert.equal(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: pathname }), true, pathname);
  }
  for (const pathname of ['/_next/static/app.js', '/favicon.ico', '/logo.png']) {
    assert.equal(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: pathname }), false, pathname);
  }
});

test('hub requests preserve their path and query without locale handling', () => {
  const loaded = loadProxy();
  for (const [pathname, method] of [
    ['/hubs/notifications?id=test-connection', 'GET'],
    ['/hubs/orders.v2/negotiate?negotiateVersion=1', 'POST'],
  ]) {
    const response = loaded.proxy(new NextRequest('https://buyer.example.com' + pathname, { method }));
    assert.equal(isRewrite(response), true);
    assert.equal(getRewrittenUrl(response), 'https://api.example.com' + pathname);
  }
  assert.equal(loaded.localeCalls(), 0);
});

test('ordinary pages still use locale handling', () => {
  const loaded = loadProxy();
  loaded.proxy(new NextRequest('https://buyer.example.com/en/orders'));
  assert.equal(loaded.localeCalls(), 1);
});
