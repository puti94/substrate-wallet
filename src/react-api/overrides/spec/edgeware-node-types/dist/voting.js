/* eslint-disable */
import { Null, bool, u64, Enum, Struct, Vec, Tuple, Option, u128 } from '@polkadot/types';
import U8aFixed from '@polkadot/types/codec/U8aFixed';
import { AnyU8a, Registry } from '@polkadot/types/types';
import AccountId from '@polkadot/types/primitive/Generic/AccountId';

export class PreVoting extends Null { }
export class Commit extends Null { }
export class Voting extends Null { }
export class Completed extends Null { }

export class VoteStage extends Enum {
  constructor (registry: Registry, value?: string, index?: number) {
    super(registry, {
      prevoting: PreVoting,
      commit: Commit,
      voting: Voting,
      completed: Completed,
    }, value, index);
  }
}

export class Binary extends Null { }
export class MultiOption extends Null { }
export class RankedChoice extends Null { }

export class VoteType extends Enum {
  constructor (registry: Registry, value?: string, index?: number) {
    super(registry, {
      binary: Binary,
      multioption: MultiOption,
      rankedchoice: RankedChoice,
    }, value, index);
  }
}

export class OnePerson extends Null { }
export class OneCoin extends Null { }

export class TallyType extends Enum {
  constructor (registry: Registry, value?: string, index?: number) {
    super(registry, {
      oneperson: OnePerson,
      onecoin: OneCoin,
    }, value, index);
  }
}

export class VoteOutcome extends U8aFixed {
  constructor (registry: Registry, value?: AnyU8a) {
    super(registry, value, 256);
  }
}

export class Tally extends Option.with(Vec.with(Tuple.with([VoteOutcome, u128]))) { }

export class VoteData extends Struct {
  constructor (registry: Registry, value: any) {
    super(registry, {
      initiator: AccountId,
      stage: VoteStage,
      vote_type: VoteType,
      tally_type: TallyType,
      is_commit_reveal: bool,
    }, value);
  }
  get initiator (): AccountId {
    return this.get('initiator');
  }
  get stage (): VoteStage {
    return this.get('stage');
  }
  get vote_type (): VoteType {
    return this.get('vote_type');
  }
  get tally_type (): TallyType {
    return this.get('tally_type');
  }
  get is_commit_reveal (): boolean {
    return this.get('is_commit_reveal');
  }
}

export class Commitments extends Vec.with(Tuple.with([AccountId, VoteOutcome])) { }
export class Reveals extends Vec.with(Tuple.with([AccountId, Vec.with(VoteOutcome)])) { }

export class VoteRecord extends Struct {
  constructor (registry: Registry, value: any) {
    super(registry, {
      id: u64,
      commitments: Commitments,
      reveals: Reveals,
      data: VoteData,
      outcomes: Vec.with(VoteOutcome),
    }, value);
  }
  get id (): u64 {
    return this.get('id');
  }
  get commitments (): Commitments {
    return this.get('commits');
  }
  get reveals (): Reveals {
    return this.get('reveals');
  }
  get data () : VoteData {
    return this.get('data');
  }
  get outcomes () : Vec<VoteOutcome> {
    return this.get('outcomes');
  }
}

export const VotingTypes = {
  PreVoting,
  Commit,
  Voting,
  Completed,
  VoteStage,
  Binary,
  MultiOption,
  VoteType,
  OnePerson,
  OneCoin,
  TallyType,
  VoteOutcome,
  Tally,
  VoteData,
  VoteRecord,
  'voting::VoteType': VoteType,
  'voting::TallyType': TallyType,
};
