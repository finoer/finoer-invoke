
import { registerApps } from './applycation/register';
import Database from '@finoer/finoer-store';
import Invoke from './invoke/index';
import Router from './router';
import { ExtendsDatabaseType, GlobalType } from './types/context';
const global: GlobalType = window
const $data: ExtendsDatabaseType = global.$data = global.$data ? global.$data : new Database()
const invoke = new Invoke()
const router = new Router(invoke)
/// <reference types="./types/phaser/phaser" />

console.log('代码更新了最终版99999', $data)
export { registerApps, invoke, router, $data}

