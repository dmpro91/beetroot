const renderEventName = 'render';
const renderEvent = new Event(renderEventName);
const input = document.querySelector("input");




const createComponent = (template) => {
  const elem = document.createElement("span");
  elem.innerHTML = template;
  return elem.firstChild;
};

let todoList = [
    {
      id: 0,
      text: "todo text 1",
      completed: false,
    },
    {
      id: 1,
      text: "todo text 2",
      completed: true,
    },
  ];

const onChecked = (checkedId) => {
    const elem = todoList.find(({id}) => checkedId === id);
    elem.completed = !elem.completed;
    document.dispatchEvent(renderEvent);

}

const onRemove = (checkedId) => {
    todoList = todoList.filter(({id}) => checkedId !== id);
    document.dispatchEvent(renderEvent);

}

const inputComponent = (text) => createComponent(`<input class="form-control" type="text" value="${text}">`);


const onEdit = (checkedId) => {
    const input = document.querySelector(`[data-id="${checkedId}"`);
    const todoElem = todoList.find(({id}) => checkedId === id);
    const label = input.nextElementSibling;
    const inputElem = label.firstElementChild;

    if (inputElem?.tagName === 'INPUT') {
        todoElem.text = inputElem.value;
        document.dispatchEvent(renderEvent);
    } else {
        label.innerHTML = '';
        label.appendChild(inputComponent(todoElem.text, checkedId))
    }
}

const todoListItemComponent = (text, isChecked, id) =>
  createComponent(`<li class="list-group-item d-flex justify-content-between align-items-center">
<div class="form-check">
    <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" ${isChecked ?? "checked"}
    data-id="${id}"
    onclick="onChecked(${id})"
    >
    <label class="form-check-label d-block" for="flexCheckChecked">
      ${text}
    </label>
  </div>
  <div class="btn-group" role="group" aria-label="Basic mixed styles example">
      <button type="button" class="btn btn-outline-primary" onclick="onEdit(${id})">Edit</button>
      <button type="button" class="btn btn-outline-primary" onclick="onRemove(${id})">Remove</button>
  </div>
</li>`);

const addCompletedClass = (elem) => {
  elem.querySelector("label").classList.add("text-decoration-line-through");
  elem.querySelector(".btn-group").firstElementChild.classList.add("disabled");
};



const todoWrapper = document.querySelector("#todo");
const completedWrapper = document.querySelector("#completed");

const validateTodo = (input, isAdd) => {
    if (isAdd) {
        input.classList.add('is-invalid');
        input.parentElement.parentElement.lastElementChild.classList.remove('visually-hidden')
    } else {
        input.classList.remove('is-invalid');
        input.parentElement.parentElement.lastElementChild.classList.add('visually-hidden')

    }
}


const add = () => {
  const input = document.querySelector("input");
  const isDuplicate = todoList.some(({text}) => input.value === text);


  if (input.value) {
      if (isDuplicate) {
        validateTodo(input, true);
      } else {
        validateTodo(input, false);
          const newTodo  = { text: input.value,  completed: false, id: Date.now()};
          input.value = '';
          todoList = [...todoList, newTodo];
            document.dispatchEvent(renderEvent);
      }
  }
};

const onEnterKeyPress = (event) => {
    if (event.code === 'Enter') {
        add();
    }
};


input.addEventListener('focus', () => {
    document.addEventListener('keypress', onEnterKeyPress);
});
input.addEventListener('blur', () => {
    document.removeEventListener('keypress', onEnterKeyPress);
});




const render = () => {
    todoWrapper.innerHTML = '';
    completedWrapper.innerHTML = '';
    todoList.forEach(({ text, completed, id }) => {
        const elem = todoListItemComponent(text, completed, id);
        if (completed) {
          addCompletedClass(elem);
          completedWrapper.appendChild(elem);
        } else {
          todoWrapper.appendChild(elem);
        }
      });
}

document.addEventListener(renderEventName, render);
document.dispatchEvent(renderEvent);


