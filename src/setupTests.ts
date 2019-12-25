// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

let localStorageMock = (function() {
  let store = new Map()
  return {
    
    getItem(key: string):string {
      return store.get(key);
    },
    
    setItem: function(key: string, value: string) {
      store.set(key, value);
    },
    
    clear: function() {
      store = new Map();
    },
    
    removeItem: function(key: string) {
        store.delete(key)
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock }); 