import {LitElement, html, css} from 'lit';
import {setLanguage} from '../../localization/index.js';

class LanguageSelector extends LitElement {
  static styles = css`
    .language-button {
      padding: 8px;
      cursor: pointer;
      border: none;
      font-size: 14px;
      color: #f15b15;
      background-color: transparent;
    }

    img {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }
  `;

  static properties = {
    currentLanguage: {type: String},
  };

  constructor() {
    super();
    this.currentLanguage = localStorage.getItem('language') || 'en';
  }

  render() {
    return html`
      <button
        class="language-button"
        @click="${() =>
          this.changeLanguage(this.currentLanguage === 'tr' ? 'en' : 'tr')}"
        ?disabled="${this.currentLanguage ===
        (this.currentLanguage === 'tr' ? 'en' : 'tr')}"
      >
        ${this.currentLanguage === 'tr'
          ? html`<img class='turkish-flag' src="/src/assets/turkish-flag.svg"></img>`
          : html`<img class='turkish-flag' src="/src/assets/england-flag.svg"></img>`}
      </button>
    `;
  }

  changeLanguage(lang) {
    setLanguage(lang);
    this.currentLanguage = lang;
    this.requestUpdate();
  }
}

customElements.define('language-selector', LanguageSelector);
