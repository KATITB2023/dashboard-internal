const parseDateISO = (date: Date) => {
  if (!date) return new Date().toISOString().split('T')[0];
  return date.toISOString().split('T')[0];
};

const parseTimeISO = (date: Date) => {
  if (!date) return new Date().toISOString().split('T')[1]?.replace('Z', '');
  return date.toISOString().split('T')[1]?.replace('Z', '');
};

const GMT7toUTC = (date: Date) => {
  if (!date) return new Date();
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
};

const UTCToGMT7 = (date: Date) => {
  if (!date) return new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};

/*
    Creates a new Date object from a GMT+7 date string.
    Format: YYYY-MM-DD
*/
export const fromGMT7DateString = (dateString: string) => {
  if (!dateString) return new Date();
  const date = new Date(dateString);
  return GMT7toUTC(date);
};

/* 
    Creates GMT+7 date string from a Date object.
    Format: YYYY-MM-DD
*/
export const toGMT7DateString = (date: Date) => {
  if (!date) return new Date().toISOString().split('T')[0];
  const utcDate = UTCToGMT7(date);
  return utcDate.toISOString().split('T')[0];
};

/* 
    Creates a new Date object that inherits date from a Date object and time from a GMT+7 time string.
    Format: HH:MM
*/
