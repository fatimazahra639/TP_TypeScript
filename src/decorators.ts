/**
 * Legacy TypeScript method decorator.
 * Enable "experimentalDecorators": true in tsconfig.json.
 */
export function Log(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (
    ...args: unknown[]
  ) => unknown;

  descriptor.value = function (
    this: unknown,
    ...args: unknown[]
  ): unknown {
    console.log(`[CALL] ${String(propertyKey)}`, args);

    try {
      const result = originalMethod.apply(this, args);
      console.log(`[RETURN] ${String(propertyKey)}`, result);
      return result;
    } catch (error: unknown) {
      console.error(`[ERROR] ${String(propertyKey)}`, error);
      throw error;
    }
  };
}

export function MeasureTime(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (
    ...args: unknown[]
  ) => unknown;

  descriptor.value = function (
    this: unknown,
    ...args: unknown[]
  ): unknown {
    const start = Date.now();

    try {
      return originalMethod.apply(this, args);
    } finally {
      console.log(
        `[TIME] ${String(propertyKey)}: ${Date.now() - start} ms`
      );
    }
  };
}
export function ValidateSpellPower(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (
    ...args: unknown[]
  ) => unknown;

  descriptor.value = function (
    this: unknown,
    ...args: unknown[]
  ): unknown {
    const spell = args[0] as { power?: unknown };

    if (
      typeof spell.power === "number" &&
      spell.power < 0
    ) {
      throw new Error(
        "La puissance du sort ne peut pas être négative."
      );
    }

    return originalMethod.apply(this, args);
  };
}
export function Cache(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (
    ...args: unknown[]
  ) => unknown;

  const cacheByInstance = new WeakMap<
    object,
    Map<string, unknown>
  >();

  descriptor.value = function (
    this: object,
    ...args: unknown[]
  ): unknown {
    let cache = cacheByInstance.get(this);

    if (!cache) {
      cache = new Map<string, unknown>();
      cacheByInstance.set(this, cache);
    }

    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log("Résultat récupéré du cache.");
      return cache.get(key);
    }

    const result = originalMethod.apply(this, args);

    cache.set(key, result);

    return result;
  };
}
