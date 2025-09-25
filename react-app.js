(() => {
  const e = React.createElement;
  function Suggestions({ stays, onPick, query }){
    const lower = (query || '').toLowerCase();
    const options = Array.from(new Set(
      stays
        .filter(s => s.name.toLowerCase().includes(lower) || s.area.toLowerCase().includes(lower))
        .map(s => s.area)
    )).slice(0, 8);
    if (!lower || options.length === 0) return null;
    return e('div', { className: 'suggestions' }, options.map((opt, i) => (
      e('div', { key: i, className: 'suggestion-item', onMouseDown: () => onPick(opt) }, opt)
    )));
  }

  window.Trip2TripSuggestions = {
    mount(root, stays, onPick, query){
      if(!root) return;
      ReactDOM.render(e(Suggestions, { stays, onPick, query }), root);
    },
    unmount(root){
      if(!root) return;
      ReactDOM.unmountComponentAtNode(root);
    }
  };
})();

