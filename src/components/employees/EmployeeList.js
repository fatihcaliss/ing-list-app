import {LitElement, html, css} from 'lit';
import {getEmployees, deleteEmployee} from '../../state/store';
import {t} from '../../localization/index.js';
import {Router} from '@vaadin/router';

class EmployeeList extends LitElement {
  static styles = css`
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin: 20px 0;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }
    th,
    td {
      border: none;
      padding: 16px 12px;
      text-align: left;
      font-size: 14px;
      color: #4a4a4a;
      border-bottom: 1px solid #f0f0f0;
    }
    th {
      background-color: #fafafa;
      color: #f15b15;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.5px;
    }
    table td:nth-child(-n + 3) {
      font-weight: 500;
    }
    button {
      cursor: pointer;
      border: none;
      background-color: transparent;
      color: #f15b15;
      transition: all 0.2s ease;
    }
    button:hover {
      opacity: 0.8;
    }

    tr.selected {
      background-color: #fff8f5;
    }

    input[type='checkbox'] {
      cursor: pointer;
      width: 18px;
      height: 18px;
      accent-color: #f15b15;
    }
    .view-buttons {
      display: flex;
      gap: 8px;
      background: #fafafa;
      padding: 4px;
      border-radius: 8px;
    }
    .view-buttons button {
      margin-right: 0;
      border: none;
      color: #666;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .view-buttons button:hover {
      background-color: #f0f0f0;
    }

    .view-buttons button.active {
      background-color: white;
      color: #f15b15;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .card-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      padding: 24px;
    }

    .card {
      border: none;
      border-radius: 12px;
      padding: 20px;
      background-color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    }
    .card-header {
      font-weight: 600;
      margin-bottom: 12px;
      color: #333;
      font-size: 16px;
    }
    .card-detail {
      margin: 8px 0;
      color: #666;
      font-size: 14px;
    }
    .card-actions {
      margin-top: 16px;
      display: flex;
      gap: 12px;
    }
    .card-actions button {
      padding: 8px;
      border-radius: 6px;
      transition: all 0.2s ease;
    }
    .card-actions button:hover {
      background-color: #fff8f5;
    }
    .edit-btn,
    .delete-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      color: #f15b15;
      margin-right: 8px;
      transition: all 0.2s ease;
    }
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .modal.visible {
      display: flex;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-content {
      background-color: white;
      padding: 32px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      text-align: center;
      max-width: 400px;
      width: 90%;
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-actions {
      margin-top: 24px;
      display: flex;
      justify-content: center;
      gap: 12px;
    }

    .modal-actions button {
      padding: 12px 24px;
      margin: 0;
      cursor: pointer;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .modal-actions button:first-child {
      background-color: #f15b15;
      color: white;
    }
    .modal-actions button:first-child:hover {
      background-color: #e04a04;
    }

    .modal-actions button:last-child {
      background-color: #f5f5f5;
      color: #666;
    }
    .modal-actions button:last-child:hover {
      background-color: #e8e8e8;
    }

    .pagination {
      margin: 32px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }
    .pagination button {
      margin: 0;
      padding: 8px 12px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      color: #666;
      border-radius: 6px;
      transition: all 0.2s ease;
      min-width: 36px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .pagination button:hover:not(:disabled) {
      background-color: #f5f5f5;
    }
    .pagination button.active {
      background-color: #f15b15;
      color: white;
    }
    .pagination .prev,
    .pagination .next {
      border-radius: 6px;
      color: #f15b15;
      font-weight: 500;
    }

    .pagination .prev:disabled,
    .pagination .next:disabled {
      cursor: not-allowed;
      color: #ccc;
    }
    .search-container {
      margin: 24px;
      background-color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }
    .search-container input {
      padding: 12px 16px;
      height: 44px;
      width: 300px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s ease;
    }
    .search-container input:focus {
      border-color: #f15b15;
      outline: none;
      box-shadow: 0 0 0 3px rgba(241, 91, 21, 0.1);
    }
    .confirmation-title {
      color: #f15b15;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .edit-icon,
    .delete-icon {
      width: 20px;
      height: 20px;
      transition: transform 0.2s ease;
    }
    button:hover .edit-icon,
    button:hover .delete-icon {
      transform: scale(1.1);
    }

    @media (max-width: 768px) {
      .search-container {
        flex-direction: column;
        padding: 12px;
        margin: 16px;
      }
      .search-container input {
        width: 100%;
      }
      .view-buttons {
        width: 100%;
        justify-content: center;
      }
      .card-container {
        padding: 16px;
        gap: 16px;
      }
      .modal-content {
        width: 95%;
        padding: 24px;
      }
    }
  `;

  static properties = {
    employees: {type: Array},
    filteredEmployees: {type: Array},
    currentPage: {type: Number},
    pageSize: {type: Number},
    searchQuery: {type: String},
    selectedRows: {type: Array},
    viewMode: {type: String},
    modalVisible: {type: Boolean},
    employeeToDelete: {type: Number},
  };

  constructor() {
    super();
    this.employees = [];
    this.filteredEmployees = [];
    this.currentPage = 1;
    this.pageSize = 12;
    this.searchQuery = '';
    this.selectedRows = [];
    this.modalVisible = false;
    this.employeeToDelete = null;
    const urlParams = new URLSearchParams(window.location.search);
    this.viewMode = urlParams.get('viewMode') || 'list';

    if (this.viewMode === 'list') {
      this.pageSize = 12;
    } else if (this.viewMode === 'table') {
      this.pageSize = 15;
    }
  }

  changeViewMode(newViewMode) {
    this.viewMode = newViewMode;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('viewMode', newViewMode);

    window.history.pushState(
      {},
      '',
      `${window.location.pathname}?${urlParams.toString()}`
    );

    window.location.reload();
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadEmployees();

    const urlParams = new URLSearchParams(window.location.search);
    this.currentPage = parseInt(urlParams.get('page')) || 1;

    document.addEventListener('language-changed', this.handleLanguageChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    const urlParams = new URLSearchParams(window.location.search);
    this.currentPage = parseInt(urlParams.get('page')) || 1;

    document.removeEventListener('language-changed', this.handleLanguageChange);
  }

  handleLanguageChange = () => {
    this.requestUpdate();
  };

  loadEmployees() {
    this.employees = getEmployees();
    this.filterEmployees();
  }

  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredEmployees.slice(start, end);
  }

  handleRowSelection(event, id) {
    if (event.target.checked) {
      this.selectedRows = [...this.selectedRows, id];
    } else {
      this.selectedRows = this.selectedRows.filter((rowId) => rowId !== id);
    }
  }

  isSelected(id) {
    return this.selectedRows.includes(id);
  }

  handleDelete(id) {
    this.employeeToDelete = id;
    this.modalVisible = true;
  }

  handleEdit(id) {
    const urlParams = new URLSearchParams(window.location.search);
    const currentViewMode = urlParams.get('viewMode') || 'list';
    Router.go(
      `/edit/${id}?page=${this.currentPage}&viewMode=${currentViewMode}`
    );
  }

  handleConfirmDelete() {
    if (this.employeeToDelete !== null) {
      deleteEmployee(this.employeeToDelete);
      this.loadEmployees();
    }
    this.modalVisible = false;
    this.employeeToDelete = null;
  }

  handleCloseModal() {
    this.modalVisible = false;
    this.employeeToDelete = null;
  }

  changePage(page) {
    this.currentPage = page;

    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url);
  }

  handleSearch(event) {
    this.searchQuery = event.target.value.toLowerCase();
    this.currentPage = 1;
    this.filterEmployees();
  }

  filterEmployees() {
    if (this.searchQuery) {
      this.filteredEmployees = this.employees.filter((employee) =>
        `${employee.firstName} ${employee.lastName} ${employee.department} ${employee.position}`
          .toLowerCase()
          .includes(this.searchQuery)
      );
    } else {
      this.filteredEmployees = this.employees;
    }
  }

  #changeViewMode(mode) {
    this.viewMode = mode;

    const url = new URL(window.location.href);
    url.searchParams.set('viewMode', mode);
    window.history.pushState({}, '', url);
  }

  render() {
    return html`
      <div class="modal ${this.modalVisible ? 'visible' : ''}">
        <div class="modal-content">
          <h2 class="confirmation-title">${t('confirmDelete')}</h2>
          <div>${t('deleteDetail')}</div>
          <div class="modal-actions">
            <button @click="${this.handleConfirmDelete}">${t('yes')}</button>
            <button @click="${this.handleCloseModal}">${t('no')}</button>
          </div>
        </div>
      </div>
      <div class="search-container">
        <input
          type="search"
          placeholder=${t('searchPlaceholder')}
          @input=${this.handleSearch}
          .value=${this.searchQuery}
        />
        <div class="view-buttons">
          <button
            class=${this.viewMode === 'list' ? 'active' : ''}
            @click=${() => {
              this.changeViewMode('list');
              window.location.reload();
            }}
          >
            ${t('listView')}
          </button>
          <button
            class=${this.viewMode === 'table' ? 'active' : ''}
            @click=${() => {
              this.changeViewMode('table');
              window.location.reload();
            }}
          >
            ${t('tableView')}
          </button>
        </div>
      </div>
      ${this.viewMode === 'list'
        ? html`
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>${t('firstName')}</th>
                  <th>${t('lastName')}</th>
                  <th>${t('employmentDate')}</th>
                  <th>${t('dateOfBirth')}</th>
                  <th>${t('Phone')}</th>
                  <th>${t('Email')}</th>
                  <th>${t('department')}</th>
                  <th>${t('position')}</th>
                  <th>${t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                ${this.paginatedEmployees.map(
                  (employee) => html`
                    <tr class=${this.isSelected(employee.id) ? 'selected' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          @change=${(e) =>
                            this.handleRowSelection(e, employee.id)}
                          ?checked=${this.isSelected(employee.id)}
                        />
                      </td>
                      <td>${employee.firstName}</td>
                      <td>${employee.lastName}</td>
                      <td>${employee.employmentDate}</td>
                      <td>${employee.dateOfBirth}</td>
                      <td>${employee.phone}</td>
                      <td>${employee.email}</td>
                      <td>${employee.department}</td>
                      <td>${employee.position}</td>
                      <td>
                        <button @click=${() => this.handleEdit(employee.id)}>
                          <img class='edit-icon' src="/src/assets/edit-icon.svg"></img>
                        </button>
                        <button @click=${() => this.handleDelete(employee.id)}>
                          <img class='delete-icon' src="/src/assets/delete-icon.svg"></img>
                        </button>
                      </td>
                    </tr>
                  `
                )}
              </tbody>
            </table>
            <div class="pagination">
              <button
                class="prev"
                ?disabled=${this.currentPage === 1}
                @click=${() => this.changePage(this.currentPage - 1)}
              >
                <
              </button>

              ${Array(Math.ceil(this.filteredEmployees.length / this.pageSize))
                .fill()
                .map(
                  (_, index) => html`
                    <button
                      class="${this.currentPage === index + 1 ? 'active' : ''}"
                      @click=${() => this.changePage(index + 1)}
                    >
                      ${index + 1}
                    </button>
                  `
                )}

              <button
                class="next"
                ?disabled=${this.currentPage ===
                Math.ceil(this.filteredEmployees.length / this.pageSize)}
                @click=${() => this.changePage(this.currentPage + 1)}
              >
                >
              </button>
            </div>
          `
        : html`
            <div class="card-container">
              ${this.paginatedEmployees.map(
                (employee) => html`
                  <div class="card">
                    <div class="card-header">
                      ${employee.firstName} ${employee.lastName}
                    </div>
                    <div class="card-detail">
                      ${t('department')}: ${employee.department}
                    </div>
                    <div class="card-detail">
                      ${t('position')}: ${employee.position}
                    </div>
                    <div class="card-actions">
                      <button @click=${() => this.handleEdit(employee.id)}>
                        <img class='edit-icon' src="/src/assets/edit-icon.svg"></img>
                      </button>
                      <button @click=${() => this.handleDelete(employee.id)}>
                        <img class='delete-icon' src="/src/assets/delete-icon.svg"></img>
                      </button>
                    </div>
                  </div>
                `
              )}
            </div>

            <div class="pagination">
              <button
                class="prev"
                ?disabled=${this.currentPage === 1}
                @click=${() => this.changePage(this.currentPage - 1)}
              >
                <
              </button>

              ${Array(Math.ceil(this.filteredEmployees.length / this.pageSize))
                .fill()
                .map(
                  (_, index) => html`
                    <button
                      class="${this.currentPage === index + 1 ? 'active' : ''}"
                      @click=${() => this.changePage(index + 1)}
                    >
                      ${index + 1}
                    </button>
                  `
                )}

              <button
                class="next"
                ?disabled=${this.currentPage ===
                Math.ceil(this.filteredEmployees.length / this.pageSize)}
                @click=${() => this.changePage(this.currentPage + 1)}
              >
                >
              </button>
            </div>
          `}
    `;
  }
}

customElements.define('employee-list', EmployeeList);
