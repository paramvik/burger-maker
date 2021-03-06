import React, { Component } from 'react';
import axios from '../../../axios-orders';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import Spinner from '../../../components/UI/Spinnner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withError from '../../../withError/withError';

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        type: 'text',
        placeholder: 'Your Name',
        value: ''
      },
      email: {
        type: 'email',
        placeholder: 'Your Email',
        value: ''
      },
      street: {
        type: 'text',
        placeholder: 'Your Address',
        value: ''
      },
      pin: {
        type: 'text',
        placeholder: 'PIN Code',
        value: ''
      },
      delivery: {
        type: 'select',
        options: ['fastest', 'cheapest'],
        value: 'fastest'
      },
    },
    loading: false
  };

  orderHandler = (event, token) => {
    event.preventDefault();

    this.setState({loading: true});
    const formData = {};
    for (let key in this.state.orderForm) {
      formData[key] = this.state.orderForm[key].value;
    }
    
    const dataToSend = {
      formData: {...formData},
      ingredients: this.props.ingredients,
      totalPrice: this.props.totalPrice,
      userId: localStorage.getItem('userId')
    };

    axios.post('/orders.json?auth=' + token, dataToSend)
    .then(() => {
      this.setState({loading: false});
      this.props.history.push('/');
    })
    .catch(error => {
      this.setState({loading: false});
      console.log(error.message);
    });
  }

  inputChangeHandler = (event, inputFieldId) => {
    const inputField = this.state.orderForm[inputFieldId];
    const newFieldValue = {...inputField, value: event.target.value};
    const newOrderForm = {...this.state.orderForm, [inputFieldId]:newFieldValue};
    this.setState({orderForm: newOrderForm});
  }

  render() {
    const formInputsArray = [];
    for(let key in this.state.orderForm) {
      formInputsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }

    let formInputs = null;

    if(this.state.loading) {
      formInputs = <Spinner/>;
    } else {
      formInputs = <form onSubmit={(event) => this.orderHandler(event, this.props.token)}>
        {formInputsArray.map(input => {
          return <Input change={(event) => this.inputChangeHandler(event, input.id)} key={input.id} attr={input} />
        })}
        <Button btnType="Success" >Order</Button>
      </form>
    }

    return (
      <div className={classes.ContactData}>
        <h3>Enter your contact info</h3>
        {formInputs}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ingredients: state.burger.ingredients,
    totalPrice: state.burger.totalPrice,
    token: state.auth.idToken,
    isAuthenticated: state.auth.loggedIn
  }
}
export default connect(mapStateToProps)(withError(ContactData, axios));