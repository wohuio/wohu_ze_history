export default {
  name: "Filtered History",
  editor: {
    label: {
      en: "Filtered History",
      de: "Gefilterte Historie",
    },
  },
  variables: [
    {
      name: "filteredUserId",
      value: null,
      type: "number",
      defaultValue: null,
    },
    {
      name: "filteredDateFrom",
      value: null,
      type: "number",
      defaultValue: null,
    },
    {
      name: "filteredDateTo",
      value: null,
      type: "number",
      defaultValue: null,
    },
    {
      name: "historyEntries",
      value: [],
      type: "array",
      defaultValue: [],
    },
    {
      name: "totalEntries",
      value: 0,
      type: "number",
      defaultValue: 0,
    },
  ],
  properties: {
    userId: {
      label: {
        en: "User ID",
        de: "Benutzer ID",
      },
      type: "Number",
      defaultValue: null,
      bindable: true,
      section: "settings",
    },
    dateFrom: {
      label: {
        en: "Date From (timestamp)",
        de: "Von Datum (timestamp)",
      },
      type: "Text",
      defaultValue: null,
      bindable: true,
      section: "settings",
      editor: {
        type: "Variable",
      },
    },
    dateTo: {
      label: {
        en: "Date To (timestamp)",
        de: "Bis Datum (timestamp)",
      },
      type: "Text",
      defaultValue: null,
      bindable: true,
      section: "settings",
      editor: {
        type: "Variable",
      },
    },
    showFilters: {
      label: {
        en: "Show Filter UI",
        de: "Filter-UI anzeigen",
      },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },
  },
};
