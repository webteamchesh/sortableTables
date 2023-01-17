"use strict"; function makeSortable(e) { const rows = Array.from(e.rows); const reg = /^-?[0-9]\d*(\.\d+)?/;
  const curr = /^£?[0-9]\d*(\.\d+)?/;
  const funcs = {};
  const icons = {};

  const note = document.createElement("p");
  note.appendChild(
    document.createTextNode("Click on a heading to sort by that column.")
  );
  note.classList.add("cec-green");
  e.parentNode.insertBefore(note, e);

  Array.from(rows[1].cells).forEach((cell, k) => {
    let f = rows[0].cells[k].innerText;
    let str = cell.innerText;
    if (parseDate(str)) {
      funcs[f] = sortDate(f);
    } else if (str.match(reg)) {
      funcs[f] = sortInitialNum(f); 
    } else if (str.match(curr)) {
      funcs[f] = sortCurr(f);
    } else {
      funcs[f] = sortStr(f); 
    }
  });

  Array.from(rows[0].cells).forEach((cell) => {
    setUp(cell);
  });

  let items = Array.from(rows).slice(1).reduce((acc, row, i) => {
    return [...acc, Array.from(row.cells).reduce((objAcc, cell, j) => {
      return {...objAcc, ...{"index": i, [key(j)]: cell.innerHTML, [`${key(j)}inner`]: parseDate(cell.innerText) 
        ? new luxon.DateTime.fromFormat(cell.innerText, "dd/MM/yyyy")
        : cell.innerText}}}, {})]}, []);

  function key(ind) {
    return Object.keys(funcs)[ind];
  }

  function sortInitialNum(f) {
    f += "inner";
    return (a, b) => {
      return (toFloat(a[f]) - toFloat(b[f]));
    };
  }

  function sortCurr(f) {
    f += 'inner';
    return (a, b) => {
      return (parseFloat(a[f].slice(1)) - parseFloat(b[f].slice(1)));
    }
  }
  
    function sortDate(f) {
    f += "inner";
    return (a, b) => {
      if (a[f] < b[f]) {
        return -1;
      }
      if (a[f] > b[f]) {
        return 1;
      }
      return 0;
    };
  }

  function sortStr(f) {
    f += "inner";
    return (a, b) => {
      let x = a[f].toLowerCase();
      let y = b[f].toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    };
  }

  function setUp(e) {
    const temp = e.innerText;
    const row = document.createElement('div');
    const container = document.createElement("div");
    const titleDiv = document.createElement('div');
    const icon = document.createElement('div');
    const up = document.createElement('span');
    const down = document.createElement('span');
    up.innerHTML = "&#9650;";
    down.innerHTML = "&#9660;";
    container.classList.add("container");
    row.classList.add("row", "align-items-center");
    e.firstChild.remove();
    e.classList.add("p-0");
    icon.classList.add("col-2", "p-0");
    up.classList.add("position-relative");
    down.classList.add("position-relative");
    up.setAttribute("style", "color: gray; bottom: .35rem;");
    icons[`${temp}up`] = up;
    icons[`${temp}down`] = down;
    down.setAttribute("style", "color: gray; top: .3rem; right: 1rem;");
    titleDiv.classList.add("col-10", "ps-1", "pe-3");
    titleDiv.innerText = temp;
    icon.appendChild(up);
    icon.appendChild(down);
    row.appendChild(titleDiv);
    row.appendChild(icon);
    container.appendChild(row);
    e.appendChild(container);
    e.setAttribute("tabindex", "0");
    e.addEventListener(
      "mouseover",
      () => (e.style.backgroundColor = "PaleGreen")
    );
    e.addEventListener("focus", () => (e.style.backgroundColor = "PaleGreen"));
    e.addEventListener("mouseout", () => (e.style.backgroundColor = "White"));
    e.addEventListener("blur", () => (e.style.backgroundColor = "White"));
    e.addEventListener("click", () => sortByField(temp));
    e.addEventListener("keydown", (e) => {
      if (e.code === "Enter") {
        sortByField(temp);
      }
    });
  }

  function resetIcons() {
    Object.keys(funcs).forEach(id => {
      icons[`${id}up`].style.color = "gray";
      icons[`${id}down`].style.color = "gray";
    });
  }

  function sortByField(f) {
    resetIcons();
    let temp = [...items];
    temp.sort(funcs[f]);
    if (temp.some((e,i) => e.index !== items[i].index)) {
      items = [...temp];
      icons[`${f}up`].style.color = "black";
    } else {
      items = [...temp].reverse();
      icons[`${f}down`].style.color = "black";
    }
    redrawTable();
  }

  function toFloat(n) {
    let match = n.match(reg);
    return match === null ? 0 : parseFloat(match);
  }

  function parseDate(str) {
    return str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) !== null;
  }

  function redrawTable() {
    Array.from(rows)
      .slice(1)
      .forEach((row, i) => {
        Array.from(row.cells).forEach((cell, j) => {
          cell.innerHTML = items[i][key(j)];
        });
      });
  }
}



Array.from(document.getElementsByTagName("table")).forEach((e) => {
  makeSortable(e);
});
