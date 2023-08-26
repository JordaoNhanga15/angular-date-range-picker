import { DataInterface } from '../../core/interfaces/DataInterface';
export const formatDate = (
  date: Date,
  callback: (date: Date) => string
): string => {
  if (!date) return '';
  return callback(date);
};

export const isBefore = (date: Date, compare: Date): Boolean => {
  if (!date || !compare) return false;
  return date.getTime() < compare.getTime();
};

export const isAfter = (date: Date, compare: Date): boolean => {
  if (!date || !compare) return false;
  return date.getTime() > compare.getTime();
};

export const transformPipeInDate = (day: number, month: number, year: number): Date => {
  return new Date(year, month, day);
};

export const splitDate = (date: string, contract: DataInterface): string[] => {
  if(!date) return [];

  const formattedString = date.replace(/\./g, '/');

  return {
    month: () => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
      });

      const parsedDate = new Date(formatter.format(new Date(formattedString)));

      return parsedDate
        .toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'numeric',
        })
        .split('/');
    },
    day: () => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });

      const parsedDate = new Date(formatter.format(new Date(formattedString)));

      return parsedDate
        .toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })
        .split('/');
    },
    year: () => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
      });

      const parsedDate = new Date(formatter.format(new Date(formattedString)));

      return parsedDate
        .toLocaleDateString('en-US', {
          year: 'numeric',
        })
        .split('/');
    },
    week: () => [],
    decade: () => [],
    century: () => [],
  }[contract.type]();
};
