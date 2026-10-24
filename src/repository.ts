import type { Wizard, Spell, NewWizard, House } from "./types";
import { Log, MeasureTime, ValidateSpellPower } from "./decorators";

export class Repository<T extends { id: number }> {
  private items: T[] = [];

  @Log
  add(item: T): void {
    this.items.push(item);
  }

  @MeasureTime
  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  update(id: number, changes: Partial<T>): boolean {
    const item = this.findById(id);

    if (!item) return false;

    Object.assign(item, changes);
    return true;
  }
}

export class WizardRepository extends Repository<Wizard> {
  addNew(wizard: NewWizard): Wizard {
    const wizards = this.getAll();

    const id = wizards.length > 0
      ? Math.max(...wizards.map(w => w.id)) + 1
      : 1;

    const newWizard: Wizard = {
      ...wizard,
      id: id
    };

    this.add(newWizard);

    return newWizard;
  }
  findByHouse(house: House): Wizard[] {
  return this.getAll().filter(
    wizard => wizard.house === house
  );
}
}
export class SpellRepository extends Repository<Spell> {
  @ValidateSpellPower
  add(spell: Spell): void {
    super.add(spell);
  }
}
