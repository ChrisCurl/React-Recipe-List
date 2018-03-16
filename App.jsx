cclass Container extends React.Component {
  constructor() {
    super();
    this.state = {
      recipes: [
                {   key: .25,
                    title: 'Pizza',
                    img: 'https://vignette.wikia.nocookie.net/benttech/images/a/a4/Pizza.jpg/revision/latest?cb=20150404024305',
                    instructions: "Whisk 3 3/4 cups flour and 1 1/2 teaspoons salt. Make a well and add 1 1/3 cups warm water, 1 tablespoon sugar and 1 packet yeast. When foamy, mix in 3 tablespoons olive oil; knead until smooth, 5 minutes. Brush with olive oil, cover in a bowl and let rise until doubled, about 1 hour 30 minutes. Divide into two 1-pound balls. Use 1 pound per recipe unless noted"
                }, {
                    key: .5,
                    title: 'Hamburger',  
                    img:'https://assets.epicurious.com/photos/57c5c6d9cf9e9ad43de2d96e/6:4/w_620%2Ch_413/the-ultimate-hamburger.jpg',
                    instructions: "2 pounds ground beef, 1 egg, beaten, 3/4 cup dry bread crumbs, 3 tablespoons evaporated milk, 2 tablespoons Worcestershire sauce, 1/8 teaspoon cayenne pepper, 2 cloves garlic, minced"
                }, {   key: .75,
                    title: 'Salad',
                    img: 'http://en.freejpg.com.ar/asset/900/a0/a0d1/F100005379.jpg',
                    instructions: "Go to the Whole Foods Salad Bar and make a salad."
                }
            ],
      counter: 3,
      showNew: false,
    }
    this.NewRecipe = this.NewRecipe.bind(this);
    this.addNewRecipe = this.addNewRecipe.bind(this);
    this.editRecipe = this.editRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
  }
  
  componentWillMount(){
        const oldData = JSON.parse(localStorage.getItem('recipes'));
        localStorage.getItem('recipes') && this.setState({recipes: oldData});
        document.body.classList.add('fonts', 'fade-color');
       
  }
  
  componentDidMount(){
       this.setState({counter: this.state.recipes.length})
  }
  
  componentDidUpdate(){
    localStorage.setItem('recipes', JSON.stringify(this.state.recipes));
  }

  NewRecipe(){
    this.setState({showNew: !this.state.showNew})
  }
  
  editRecipe(editObj, indexInh){
    const tempRecipe = this.state.recipes;
    tempRecipe.forEach(function(item, index){if (item.key ==indexInh) {tempRecipe[index] = editObj} })
    this.setState({recipes: tempRecipe});
  }
  
  addNewRecipe(newItem){
    const newState = this.state.recipes.concat(newItem);
    this.setState({recipes: newState});
        console.log(this.state.counter);
       this.setState({counter: newState.length})
        console.log('recipes length'+ newState.length);

   // this.saveState;
  }
  
  deleteRecipe(val){
    const tempRecipe = this.state.recipes;
    for(let i = 0; i<tempRecipe.length ; i++) {
      if(tempRecipe[i].key == val) {
        tempRecipe.splice(i,1);
      }
         console.log(tempRecipe)
    }
    console.log('val is '+ val)
    
 
    
     this.setState({recipes: tempRecipe});
       this.setState({counter: this.state.recipes.length})
  }
  saveState(){
    localStorage.setItem('recipes', JSON.stringify(this.state.recepies))
  }
  
  render() {
    return (
      <div className='appContainer'>
        <h1 className = 'centerText'>Recipe List</h1>
        <div className = 'center'>
        {this.state.showNew && <NewItem counter={this.state.counter} hideNewRecipe={this.hideNewRecipe} addNewRecipe={this.addNewRecipe} showRecipe={this.NewRecipe} />}
        <button onClick = {()=> {this.NewRecipe()}} className= 'addNew'>Add Recipe</button>
        <AllFoods data={this.state.recipes} show={this.state.show} editRecipe= {this.editRecipe} deleteRecipe={this.deleteRecipe} />
        </div>
        <Footer />
      </div>
    )
  }
}

class AllFoods extends React.Component {
  constructor() {
    super()
    this.state = {
      shown: false,
      showEdit: false,
      index: 0
    }
    this.display = this.display.bind(this);
    this.noDisplay = this.noDisplay.bind(this);
    this.showEdit = this.showEdit.bind(this);
    this.hideEdit = this.hideEdit.bind(this);
  };
  
  componentDidUpdate(){
  }
  
  display(val){
    (this.state.shown == false && this.state.showEdit === false) && this.setState({shown: true, index: val});
  }
  
  noDisplay(val){
    this.setState({shown: false, index: val});
    
  }
  
  showEdit(val){
    this.noDisplay(val);
    this.setState({showEdit: true});
  }
  
  hideEdit(){
    this.setState({showEdit: false});
  }
  
    render(){
      return (
      <div> 
          <div>{this.props.data.map(item => {
              return <div className='foodBox' key={item.key} onClick = {() => this.display(item.key)}>
                <h1>{item.title}</h1>
                <img src={item.img} />
                {/*Edit container*/}
                      {(this.state.showEdit && item.key === this.state.index) && <EditItem index={item.key} title={item.title} instructions={item.instructions} editRecipe={this.props.editRecipe} hideEdit={this.hideEdit} />}
                {/*Show individual food container*/}
                      {(item.key === this.state.index && this.state.shown) && <FoodShown noDisplay={this.noDisplay} instructions={item.instructions} index = {item.key} showEdit={this.showEdit} hideEdit={this.hideEdit} deleteRecipe={this.props.deleteRecipe} />}
                     </div>
        })}</div>
          
      </div>
  );
  }
} 

class FoodShown extends React.Component {
  constructor() {
    super()
    this.deleteFunc = this.deleteFunc.bind(this);
  };
  
  deleteFunc(val){
    this.props.deleteRecipe(val);
    this.props.hideEdit();
    this.props.noDisplay();
  }
  
  render() {
    return (
      <div>
        {this.props.instructions}
        <button onClick ={() => {this.props.showEdit(this.props.index)}}>Edit</button>
        <button onClick = {() => {this.props.noDisplay(this.props.index)}}>Cancel</button>
        <button onClick = {() => {this.deleteFunc(this.props.index)}}>Delete</button>
      </div>
    )
  }
  
}

class NewItem extends React.Component{
  constructor() {
    super()
    this.state={
      title: '',
      instructions: '',
      img: ''
    }
    this.setInstructions = this.setInstructions.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.createFood = this.createFood.bind(this);
    this.setImg = this.setImg.bind(this);
  }
  
  setTitle(event){
    this.setState({title: event.target.value});
  }
  
  setInstructions(event){
    this.setState({instructions: event.target.value});
  }
  
  setImg(event){
    this.setState({img: event.target.value});
  }
  
  createFood(){
    this.props.showRecipe();
    const key = Math.floor(Math.random()*1000);
    console.log(key)
   const newFood = {key: key, img: this.state.img, title: this.state.title, instructions: this.state.instructions};
   this.props.addNewRecipe(newFood);
   this.props.newRecipe;
  }
  
  render(){
    return(
      <div>
        <h2>
          Add a new recipe
        </h2>
        <hr />
        <div>
        <h1>Title</h1>
        <input onChange = {this.setTitle}></input>
        <h1>Image</h1>
        <input onChange={this.setImg}></input> 
        <h1>Instructions</h1>
        <textarea onChange = {this.setInstructions}></textarea>
          <button onClick={this.createFood}>Submit</button>
          <button onClick={this.props.showRecipe}>Cancel</button>
        </div>
      </div>
    )
  }
}

class EditItem extends React.Component{
  constructor() {
    super()
    this.state = {
      title: '',
      instructions: ''
    }
    this.sendObject = this.sendObject.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.setInstructions = this.setInstructions.bind(this);
  };
  
  componentDidMount(){
    this.setState({title: this.props.title, instructions: this.props.instructions});
  }
  
  setTitle(event){
    this.setState({title: event.target.value});
  }
  
  setInstructions(event){
    this.setState({instructions: event.target.value});
    console.log(this.state.instructions);
  }
  
  sendObject(){
    this.props.hideEdit();
    const editObj = {key: this.props.index, title: this.state.title, instructions: this.state.instructions};
    this.props.editRecipe(editObj, this.props.index);
  }
  
  render() {
  return(
    <div>
      <input defaultValue = {this.props.title} onChange={this.setTitle}></input>
      <hr />
      <textarea defaultValue ={this.props.instructions} onChange={this.setInstructions}></textarea>
      <button onClick ={this.sendObject}>Submit</button>
    </div>
  )
  }  
}

function Footer(props) {
  return (
    <footer className='footer'>
      <p>Chris Curl 2018</p>
    </footer>
  )
}





function App() {
  return <div>
        <Container />
         </div>
}

const root = document.getElementById('App');
ReactDOM.render(<App />, root);        

