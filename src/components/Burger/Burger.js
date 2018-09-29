import React from 'react';

import BurgerIngredient from './BurgerIndredients/BurgerIngredients';
import classes from './Burger.css';

const Burger = (props) => {
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      <BurgerIngredient type="bread-bottom" />
    </div>
  );

}

export default Burger;