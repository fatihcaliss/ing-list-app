/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {EmployeeList} from '../src/components/employees/EmployeeList.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('employee-list', () => {
  test('is defined', () => {
    const el = document.createElement('employee-list');
    assert.instanceOf(el, EmployeeList);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="modal">
        <div class="modal-content">
          <h2 class="confirmation-title"></h2>
          <div></div>
          <div class="modal-actions">
            <button></button>
            <button></button>
          </div>
        </div>
      </div>
      <div class="search-container">
        <input type="search" placeholder="">
        <div class="view-buttons">
          <button class="active">List View</button>
          <button>Table View</button>
        </div>
      </div>
      <div class="card-container"></div>
      <div class="pagination">
        <button class="prev" disabled><</button>
        <button class="next" disabled>></button>
      </div>
    `
    );
  });

  test('handles search input', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const searchInput = el.shadowRoot.querySelector('input[type="search"]');
    searchInput.value = 'test';
    searchInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    assert.equal(el.searchQuery, 'test');
  });

  test('handles view mode change', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const tableButton = el.shadowRoot.querySelector(
      '.view-buttons button:last-child'
    );
    tableButton.click();
    await el.updateComplete;
    assert.equal(el.viewMode, 'table');
  });

  test('handles pagination', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const nextButton = el.shadowRoot.querySelector('.next');
    nextButton.click();
    await el.updateComplete;
    assert.equal(el.currentPage, 2);
  });

  test('handles delete confirmation modal', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    el.employees = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        department: 'IT',
        position: 'Developer',
        employmentDate: '2023-01-01',
        dateOfBirth: '1990-01-01',
        phone: '123-456-7890',
        email: 'john@example.com',
      },
    ];
    await el.updateComplete;

    const deleteButton = el.shadowRoot.querySelector('.delete-btn');
    deleteButton.click();
    await el.updateComplete;
    assert.isTrue(el.modalVisible);
    assert.equal(el.employeeToDelete, 1);
  });

  test('updates pagination when filtered results change', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    el.employees = Array(20)
      .fill()
      .map((_, i) => ({
        id: i + 1,
        firstName: `Employee ${i + 1}`,
        lastName: 'Test',
        department: 'IT',
        position: 'Developer',
      }));
    el.filterEmployees();
    const nextButton = el.shadowRoot.querySelector('.next');
    assert.isFalse(nextButton.disabled);
  });
});
