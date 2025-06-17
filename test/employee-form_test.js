/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {EmployeeForm} from '../src/components/employees/EmployeeForm.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('employee-form', () => {
  test('component is defined', () => {
    const el = document.createElement('employee-form');
    assert.instanceOf(el, EmployeeForm);
  });

  test('renders basic form structure', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    // Check if main elements exist
    assert.exists(el.shadowRoot.querySelector('form'));
    assert.exists(el.shadowRoot.querySelector('h1'));
    assert.exists(el.shadowRoot.querySelector('button[type="submit"]'));
  });

  test('form has all required input fields', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    // Check required input fields
    assert.exists(el.shadowRoot.querySelector('#firstName'));
    assert.exists(el.shadowRoot.querySelector('#lastName'));
    assert.exists(el.shadowRoot.querySelector('#email'));
    assert.exists(el.shadowRoot.querySelector('#phone'));
    assert.exists(el.shadowRoot.querySelector('#department'));
    assert.exists(el.shadowRoot.querySelector('#position'));
    assert.exists(el.shadowRoot.querySelector('#employmentDate'));
    assert.exists(el.shadowRoot.querySelector('#dateOfBirth'));
  });

  test('form validation shows errors for empty fields', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    const form = el.shadowRoot.querySelector('form');

    // Submit empty form
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;

    // Check if errors object has required fields
    assert.isTrue(Object.keys(el.errors).length > 0);
    assert.exists(el.errors.firstName);
    assert.exists(el.errors.lastName);
    assert.exists(el.errors.email);
  });

  test('form updates employee data on input', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    // Test firstName input
    const firstNameInput = el.shadowRoot.querySelector('#firstName');
    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    assert.equal(el.employee.firstName, 'John');

    // Test email input
    const emailInput = el.shadowRoot.querySelector('#email');
    emailInput.value = 'john@example.com';
    emailInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    assert.equal(el.employee.email, 'john@example.com');
  });
});
