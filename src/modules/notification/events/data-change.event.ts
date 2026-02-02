export enum DataChangeType {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
}

export class DataChangeEvent {
  constructor(
    public readonly key: string,
    public readonly changeType: DataChangeType,
    public readonly storageType: string,
    public readonly data?: any,
  ) {}
}

