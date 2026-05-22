import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from '../constants/default-categories';

type DefaultCategoryInput = {
  categoryname: string;
  type: 'income' | 'expense';
  userId: string;
  isDefault: boolean;
};

export function buildDefaultCategories(userId: string): DefaultCategoryInput[] {
  return [
    ...DEFAULT_INCOME_CATEGORIES.map((name) => ({
      categoryname: name,
      type: 'income' as const,
      userId,
      isDefault: true,
    })),
    ...DEFAULT_EXPENSE_CATEGORIES.map((name) => ({
      categoryname: name,
      type: 'expense' as const,
      userId,
      isDefault: true,
    })),
  ];
}