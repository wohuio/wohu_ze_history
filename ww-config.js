export default {
  name: "Filtered History",
  editor: {
    label: {
      en: "Filtered History",
      de: "Gefilterte Historie",
    },
  },
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
    // Read-only properties (component state)
    filteredUserId: {
      label: {
        en: "Filtered User ID (read-only)",
        de: "Gefilterte User ID (read-only)",
      },
      type: "Number",
      defaultValue: null,
      bindable: true,
      section: "settings",
      readonly: true,
      hidden: true,
    },
    filteredDateFrom: {
      label: {
        en: "Filtered Date From (read-only)",
        de: "Gefiltertes Von-Datum (read-only)",
      },
      type: "Number",
      defaultValue: null,
      bindable: true,
      section: "settings",
      readonly: true,
      hidden: true,
    },
    filteredDateTo: {
      label: {
        en: "Filtered Date To (read-only)",
        de: "Gefiltertes Bis-Datum (read-only)",
      },
      type: "Number",
      defaultValue: null,
      bindable: true,
      section: "settings",
      readonly: true,
      hidden: true,
    },
    historyEntries: {
      label: {
        en: "History Entries (read-only)",
        de: "History-Einträge (read-only)",
      },
      type: "Array",
      defaultValue: [],
      bindable: true,
      section: "settings",
      readonly: true,
      hidden: true,
    },
    totalEntries: {
      label: {
        en: "Total Entries (read-only)",
        de: "Anzahl Einträge (read-only)",
      },
      type: "Number",
      defaultValue: 0,
      bindable: true,
      section: "settings",
      readonly: true,
      hidden: true,
    },
  },
};
