const list = document.querySelector('ul');
const form = document.querySelector('form');
const button = document.querySelector('button');
 
const addRecipe = (MyApp, id) => {
  let time = MyApp.created_at.toDate();
  let html = `
    <li data-id="${id}">
      <div>${MyApp.tittle}</div>
      <div><small>${time}</small></div>
      <button class="btn btn-danger btn-sm my-2">delete</button>
    </li>
  `;

  list.innerHTML += html;
};

const deleteRecipe = (id) => {
  const recipes = document.querySelectorAll('li');
  recipes.forEach(recipe => {
    if(recipe.getAttribute('data-id') === id){
      recipe.remove();
    }
  });
};

// real-time listener
const unsub = db.collection('MyApp').onSnapshot(snapshot => {
  console.log(snapshot.docChanges());
  snapshot.docChanges().forEach(change => {
    const doc = change.doc;
    if(change.type === 'added'){
      // console.log(doc);
      addRecipe(doc.data(), doc.id)
    } else if (change.type === 'removed'){
      deleteRecipe(doc.id);
    }
  });
});

// save documents
form.addEventListener('submit', e => {
  e.preventDefault();

  const now = new Date();
  const newItem = {
    tittle: form.recipe.value,
    created_at: firebase.firestore.Timestamp.fromDate(now)
  };

  db.collection('MyApp').add(newItem).then(() => {
    form.reset();
  }).catch(err => {
    console.log(err);
  });
});

// deleting data
list.addEventListener('click', e => {
  if(e.target.tagName === 'BUTTON'){
    const id = e.target.parentElement.getAttribute('data-id');
    db.collection('MyApp').doc(id).delete().then(() => {
      // console.log('recipe deleted');
    });
  }
});

button.addEventListener('click', () => {
    unsub();
})