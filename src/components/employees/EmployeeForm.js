import {LitElement, html, css} from 'lit';
import {getEmployees} from '../../state/store';
import {t} from '../../localization/index.js';

class EmployeeForm extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      width: 100%;
      box-sizing: border-box;
    }

    h1 {
      color: #f15b15;
      margin: 0 0 24px 0;
      font-weight: 600;
      font-size: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .error {
      color: #dc2626;
      font-size: 13px;
      margin: 4px 0 12px;
      font-weight: 500;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #f15b15;
      padding: 4px;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background-color: rgba(241, 91, 21, 0.1);
      transform: scale(1.1);
    }

    label {
      margin-top: 12px;
      display: block;
      font-weight: 500;
      color: #374151;
      font-size: 14px;
    }

    select,
    input {
      width: 100%;
      max-width: 100%;
      padding: 10px 12px;
      margin: 6px 0;
      border: 1.5px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s ease;
      background-color: #f9fafb;
      box-sizing: border-box;
    }

    select:focus,
    input:focus {
      outline: none;
      border-color: #f15b15;
      box-shadow: 0 0 0 3px rgba(241, 91, 21, 0.1);
      background-color: #ffffff;
    }

    select:hover,
    input:hover {
      border-color: #f15b15;
    }

    button {
      padding: 12px 20px;
      background-color: #f15b15;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      margin-top: 24px;
      width: 100%;
    }

    button:hover {
      background-color: #d94d12;
      transform: translateY(-1px);
    }

    button:active {
      transform: translateY(0);
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(4px);
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 32px;
      border-radius: 12px;
      max-width: 400px;
      width: 90%;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .modal-content h2 {
      color: #111827;
      margin: 0 0 16px;
      font-size: 20px;
    }

    .modal-content p {
      color: #4b5563;
      margin: 0 0 24px;
      font-size: 15px;
    }

    .modal-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .modal-buttons button {
      margin: 0;
      width: auto;
      min-width: 100px;
    }

    .modal-buttons button:last-child {
      background-color: #e5e7eb;
      color: #374151;
    }

    .modal-buttons button:last-child:hover {
      background-color: #d1d5db;
    }

    .employee-form {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    @media (max-width: 768px) {
      :host {
        padding: 16px;
        margin: 0;
        border-radius: 0;
      }

      select,
      input {
        width: 100%;
      }
    }
  `;

  static properties = {
    employee: {type: Object},
    isEditMode: {type: Boolean},
    currentPage: {type: Number},
    errors: {type: Object},
    modalVisible: {type: Boolean},
  };

  constructor() {
    super();
    this.employee = {
      id: null,
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phoneNumber: '',
      email: '',
      department: '',
      position: '',
      birthDate: '',
      employmentDate: '',
    };
    this.errors = {};
    this.isEditMode = false;
    this.currentPage = 1;
    this.modalVisible = false;
  }

  connectedCallback() {
    super.connectedCallback();
    const urlParams = new URLSearchParams(window.location.search);
    this.currentPage = parseInt(urlParams.get('page')) || 1;
    const id = parseInt(this.location?.params?.id);
    if (id) {
      this.isEditMode = true;
      const employees = getEmployees();
      const employee = employees.find((emp) => emp.id === id);
      if (employee) this.employee = {...employee};
    }
  }

  validateForm() {
    const errors = {};
    if (!this.employee.firstName) {
      errors.firstName = t('firstNameRequired');
    }
    if (!this.employee.lastName) {
      errors.lastName = t('lastNameRequired');
    }
    if (!this.employee.email) {
      errors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(this.employee.email)) {
      errors.email = t('invalidEmail');
    }
    if (!this.employee.phone) {
      errors.phone = t('phoneRequired');
    } else if (!/^\d+$/.test(this.employee.phone)) {
      errors.phone = t('invalidPhone');
    }
    if (!this.employee.department) {
      errors.department = t('departmentRequired');
    }
    if (!this.employee.position) {
      errors.position = t('positionRequired');
    }
    if (!this.employee.employmentDate) {
      errors.employmentDate = t('employmentDateRequired');
    }
    if (!this.employee.dateOfBirth) {
      errors.dateOfBirth = t('dateOfBirthRequired');
    }
    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  handleClose() {
    const urlParams = new URLSearchParams(window.location.search);
    const viewMode = urlParams.get('viewMode') || 'list';
    window.location.href = `/?page=${this.currentPage}&viewMode=${viewMode}`;
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.validateForm()) {
      return;
    }

    this.modalVisible = true;
  }

  handleConfirmSubmit() {
    let employees = JSON.parse(localStorage.getItem('employees')) || [];
    if (this.isEditMode) {
      const index = employees.findIndex((emp) => emp.id === this.employee.id);
      if (index !== -1) {
        employees[index] = {...this.employee};
      }
    } else {
      this.employee.id = Date.now();
      employees.push(this.employee);
    }
    localStorage.setItem('employees', JSON.stringify(employees));

    this.modalVisible = false;
    this.redirectToList();
    const urlParams = new URLSearchParams(window.location.search);
    const viewMode = urlParams.get('viewMode') || 'list';
    window.location.href = `/?page=${this.currentPage}&viewMode=${viewMode}`;
  }

  handleCloseModal() {
    this.modalVisible = false;
  }

  redirectToList() {
    const urlParams = new URLSearchParams(window.location.search);
    const viewMode = urlParams.get('viewMode') || 'list';
    window.location.href = `/?page=1&viewMode=${viewMode}`;
  }

  render() {
    return html`
      <div>
        <h1>
          ${this.isEditMode ? t('editEmployee') : t('addEmployee')}
          <button class="close-btn" @click=${this.handleClose}>×</button>
        </h1>
        <form @submit=${this.handleSubmit} class="employee-form">
          <label for="firstName">${t('firstName')}</label>
          <input
            type="text"
            id="firstName"
            .value=${this.employee.firstName}
            @input=${(e) => (this.employee.firstName = e.target.value)}
          />
          <div class="error">${this.errors.firstName || ''}</div>

          <label for="lastName">${t('lastName')}</label>
          <input
            type="text"
            id="lastName"
            .value=${this.employee.lastName}
            @input=${(e) => (this.employee.lastName = e.target.value)}
          />
          <div class="error">${this.errors.lastName || ''}</div>

          <label for="email">${t('email')}</label>
          <input
            type="email"
            id="email"
            .value=${this.employee.email}
            @input=${(e) => (this.employee.email = e.target.value)}
          />
          <div class="error">${this.errors.email || ''}</div>

          <label for="phone">${t('phone')}</label>
          <input
            type="tel"
            id="phone"
            .value=${this.employee.phone || ''}
            @input=${(e) => (this.employee.phone = e.target.value)}
          />
          <div class="error">${this.errors.phone || ''}</div>

          <label for="department">${t('department')}</label>
          <select
            id="department"
            .value=${this.employee.department}
            @change=${(e) => (this.employee.department = e.target.value)}
          >
            <option value="">${t('selectDepartment')}</option>
            <option value="Tech">${t('tech')}</option>
            <option value="Analytics">${t('analytics')}</option>
          </select>
          <div class="error">${this.errors.department || ''}</div>

          <label for="position">${t('position')}</label>
          <select
            id="position"
            .value=${this.employee.position}
            @change=${(e) => (this.employee.position = e.target.value)}
          >
            <option value="">${t('selectPosition')}</option>
            <option value="Junior">${t('junior')}</option>
            <option value="Medior">${t('medior')}</option>
            <option value="Senior">${t('senior')}</option>
          </select>
          <div class="error">${this.errors.position || ''}</div>

          <label for="employmentDate">${t('employmentDate')}</label>
          <input
            type="date"
            id="employmentDate"
            .value=${this.employee.employmentDate}
            @input=${(e) => (this.employee.employmentDate = e.target.value)}
          />
          <div class="error">${this.errors.employmentDate || ''}</div>

          <label for="dateOfBirth">${t('dateOfBirth')}</label>
          <input
            type="date"
            id="dateOfBirth"
            .value=${this.employee.dateOfBirth}
            @input=${(e) => (this.employee.dateOfBirth = e.target.value)}
          />
          <div class="error">${this.errors.dateOfBirth || ''}</div>

          <button
            type="submit"
            @click="${() => this.handleEdit(this.employee.id)}"
          >
            ${this.isEditMode ? t('updateEmployee') : t('addEmployee')}
          </button>
        </form>
        <!-- Modal confirmation -->
        ${this.modalVisible
          ? html`
              <div class="modal-overlay">
                <div class="modal-content">
                  <h2>${t('confirmSubmit')}</h2>
                  <p>${t('areYouSureSubmit')}</p>
                  <div class="modal-buttons">
                    <button @click=${this.handleConfirmSubmit}>
                      ${t('yes')}
                    </button>
                    <button @click=${this.handleCloseModal}>${t('no')}</button>
                  </div>
                </div>
              </div>
            `
          : ''}
      </div>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
