$(() => {

  // View ////////////////////////////////////////////////////////////////////////
  var template = _.template(`
    <li data-id="<%=id%>" class="todo">
      <span><%=text%></span>
      <span><%=new Date()%></span>
      <button data-action="edit">edit</button>
      <button data-action="done">&#x2714;</button>
    </li>
  `);

  var renderTodo = (todo) => {
    return template(todo);
  };

  var addTodo = (todo, date) => {
    $('#todos').append(renderTodo(todo, date));
  };

  var changeTodo = (id, todo) => {
    $(`#todos [data-id=${id}]`).replaceWith(renderTodo(todo));
  };

  var removeTodo = (id) => {
    $(`#todos [data-id=${id}]`).remove();
  };

  var addAllTodos = (todos) => {
    _.each(todos, (todo) => {
      addTodo(todo);
    });
  };

  // Controller //////////////////////////////////////////////////////////////////

  $('#form button').click( (event) => {
    var text = $('#form input').val().trim();
    var date = new Date();
    if (text) {
      Todo.create(text, date, addTodo);
    }
    $('#form input').val('');
  });

  $('#todos').delegate('button', 'click', (event) => {
    var id = $(event.target.parentNode).data('id');
    if ($(event.target).data('action') === 'edit') {
      Todo.readOne(id, (todo) => {
        var updatedText = prompt('Change to?', todo.text);
        if (updatedText !== null && updatedText !== todo.text) {
          Todo.update(id, updatedText, changeTodo.bind(null, id));
        }
      });
    } else {
      Todo.delete(id, removeTodo.bind(null, id));
    }
  });

  // Initialization //////////////////////////////////////////////////////////////

  console.log('CRUDdy Todo client is running the browser');
  Todo.readAll(addAllTodos);

});
