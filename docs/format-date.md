import { format } from 'date-fns';

const requestData = {
startDate: format(filterData.from, 'yyyy-MM-dd'), // "2026-02-05"
endDate: format(filterData.to, 'yyyy-MM-dd'), // "2026-02-05"
timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
// ...
};
