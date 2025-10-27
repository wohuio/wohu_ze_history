<template>
  <div class="filtered-history">
    <!-- Filter Section -->
    <div v-if="content.showFilters" class="filters">
      <h3>Filter</h3>
      <div class="filter-grid">
        <div class="filter-item">
          <label>Zeitraum</label>
          <select v-model="localPeriod" class="filter-input">
            <option value="day">Tag</option>
            <option value="week">Woche</option>
            <option value="month">Monat</option>
            <option value="year">Jahr</option>
          </select>
        </div>
        <div class="filter-item filter-actions">
          <button @click="applyFilter" class="filter-button" :disabled="loading || !content.userId">
            <span class="filter-icon">🔍</span>
            Filtern
          </button>
          <button @click="clearFilter" class="clear-button" :disabled="!content.userId">
            ✕ Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !entries.length" class="loading">
      <div class="spinner"></div>
      <p>Daten werden geladen...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>❌ {{ error }}</p>
    </div>

    <!-- Table -->
    <div v-else-if="entries.length > 0" class="table-container">
      <div class="table-header">
        <h3>{{ entries.length }} Einträge gefunden</h3>
        <button @click="loadData" class="refresh-button" :disabled="loading">
          <span class="refresh-icon" :class="{ spinning: loading }">↻</span>
          Aktualisieren
        </button>
      </div>

      <table class="history-table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Start</th>
            <th>Ende</th>
            <th>Arbeitszeit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in sortedEntries" :key="entry.id || index">
            <td>{{ formatDate(entry.clock_in) }}</td>
            <td>{{ formatTime(entry.clock_in) }}</td>
            <td>{{ formatTime(entry.clock_out) }}</td>
            <td>{{ formatDuration(entry.duration_minutes) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p v-if="!content.userId">Bitte User ID in den Properties binden.</p>
      <p v-else>Keine Einträge gefunden. Versuche andere Filter.</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
  },
  emits: ['update:content', 'trigger-event'],
  setup(props) {
    // Internal variables for WeWeb
    const { value: currentPeriodVar, setValue: setCurrentPeriodVar } =
      window.wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: 'currentPeriod',
        type: 'string',
        defaultValue: 'week',
      });

    return {
      currentPeriodVar,
      setCurrentPeriodVar,
    };
  },
  data() {
    return {
      entries: [],
      loading: false,
      error: null,
      localUserId: null,
      localPeriod: 'week',
      currentPage: 1,
    };
  },
  computed: {
    sortedEntries() {
      return [...this.entries].sort((a, b) => {
        return (b.clock_in || 0) - (a.clock_in || 0);
      });
    },
  },
  watch: {
    'content.userId': {
      handler(newVal) {
        this.localUserId = newVal;
      },
      immediate: true,
    },
    'content.period': {
      handler(newVal) {
        if (newVal) {
          this.localPeriod = newVal;
        }
      },
      immediate: true,
    },
    localPeriod(newVal) {
      this.setCurrentPeriodVar(newVal);
    },
  },
  mounted() {
    console.log('=== HISTORY COMPONENT MOUNTED ===');
    console.log('content.userId:', this.content.userId);
    console.log('content.period:', this.content.period);
    console.log('content.showFilters:', this.content.showFilters);
    console.log('Full content:', this.content);

    // Initialize WeWeb variables with current values
    this.setCurrentPeriodVar(this.localPeriod);

    // Only load if user_id is set (required by API)
    if (this.content.userId) {
      console.log('✓ userId is set, calling loadData()');
      this.loadData();
    } else {
      console.log('✗ userId is NOT set, skipping loadData()');
    }
  },
  methods: {
    async loadData() {
      // Don't load without user_id (API requirement)
      if (!this.content.userId) {
        this.error = 'User ID is required';
        this.entries = [];
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const params = new URLSearchParams();

        // User ID (required)
        params.append('user_id', String(this.content.userId));

        // Period (from properties or local filter)
        const period = this.content.period || this.localPeriod || 'week';
        params.append('period', period);

        console.log('API Call Parameters:', {
          user_id: this.content.userId,
          period: period
        });

        const url = `https://xv05-su7k-rvc8.f2.xano.io/api:6iYtDb6K:v1/time_entries/history/filtered?${params.toString()}`;

        console.log('Fetching filtered history from:', url);

        const response = await fetch(url);

        if (!response.ok) {
          // Try to get error details from response
          let errorMessage = `API Error ${response.status}`;
          try {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
          } catch (e) {
            const errorText = await response.text();
            console.error('API Error Text:', errorText);
            if (errorText) errorMessage += ': ' + errorText;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();

        // API returns object with entries array, not direct array
        if (data && data.entries && Array.isArray(data.entries)) {
          this.entries = data.entries;
          console.log('Loaded entries:', data.entries.length, 'Period:', data.period_label);
        } else {
          this.entries = [];
          console.warn('Unexpected API response format:', data);
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    applyFilter() {
      this.loadData();
    },
    clearFilter() {
      // Reset to defaults
      this.localPeriod = 'week';
      this.currentPage = 1;
      this.loadData();
    },
    formatDate(timestamp) {
      if (!timestamp) return '-';
      const ts = parseInt(timestamp);
      // Convert to milliseconds if in seconds
      const msTimestamp = ts < 10000000000 ? ts * 1000 : ts;
      return new Date(msTimestamp).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    },
    formatTime(timestamp) {
      if (!timestamp) return '-';
      const ts = parseInt(timestamp);
      // Convert to milliseconds if in seconds
      const msTimestamp = ts < 10000000000 ? ts * 1000 : ts;
      return new Date(msTimestamp).toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    formatDuration(minutes) {
      if (!minutes && minutes !== 0) return '-';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    },
  },
};
</script>

<style scoped>
.filtered-history {
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
}

/* Filters */
.filters {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filters h3 {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.filter-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.filter-input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.filter-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.filter-actions {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.filter-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.filter-button:hover:not(:disabled) {
  background: #45a049;
}

.filter-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.filter-icon {
  font-size: 16px;
}

.clear-button {
  padding: 10px 16px;
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-button:hover {
  background: #e0e0e0;
  border-color: #bbb;
}

/* Loading & Error */
.loading,
.error,
.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 16px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #d32f2f;
}

.empty-state {
  color: #666;
}

/* Table */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.table-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.refresh-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.refresh-button:hover:not(:disabled) {
  background: #45a049;
}

.refresh-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.refresh-icon {
  font-size: 16px;
  display: inline-block;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th,
.history-table td {
  padding: 16px 24px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.history-table th {
  background: #f9f9f9;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  color: #666;
  letter-spacing: 0.5px;
}

.history-table tbody tr {
  transition: background 0.2s;
}

.history-table tbody tr:hover {
  background: #f9f9f9;
}

.history-table tbody tr:last-child td {
  border-bottom: none;
}

.history-table td {
  font-size: 14px;
  color: #333;
}

/* Responsive */
@media (max-width: 768px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .refresh-button {
    width: 100%;
    justify-content: center;
  }

  .history-table {
    font-size: 13px;
  }

  .history-table th,
  .history-table td {
    padding: 12px 16px;
  }
}
</style>
