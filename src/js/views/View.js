import icons from '../../img/icons.svg';
import spinner from '../../img/spinner.svg';

export default class View {
  _data;

  /** ---- JS Documentation -----
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} point to the View instance
   * @author Vaggelis Manousakis
   * @todo Finish implementation
   */
  render(data, render = true) {
    // if (!data) won't work for an empty array []. only for undefined or null.
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderErrorMessage();
    }

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    // Initialization - Setting the container HTML to empty before filling with useful info in order to make the message disappear: "Start by searching for a recipe or an ingredient. Have fun!"
    this._clearInnerHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    // Checking which elements of the pages have changed and push them to an array
    // Then render only them when clicking on a different recipe
    newElements.forEach((newElement, index) => {
      const currentElement = currentElements[index];
      // Updates changed TEXT
      if (
        !newElement.isEqualNode(currentElement) &&
        newElement.firstChild?.nodeValue.trim() !== ''
      ) {
        currentElement.textContent = newElement.textContent;
      }
      // Updates changed ATTRIBUTES
      if (!newElement.isEqualNode(currentElement))
        Array.from(newElement.attributes).forEach(attribute =>
          currentElement.setAttribute(attribute.name, attribute.value)
        );
    });
  }

  _clearInnerHTML() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner = () => {
    const markup = `
      <div class="spinner">
        <img src="${spinner}" alt="Loading..." class="spinner-img" />
      </div>
    `;
    this._clearInnerHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  renderErrorMessage = (errorMessage = this._errorMessage) => {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${errorMessage}</p>
      </div>
      `;
    this._clearInnerHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  renderSuccessMessage = (successMessage = this._successMessage) => {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${successMessage}</p>
      </div>
      `;
    this._clearInnerHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };
}
