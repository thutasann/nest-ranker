/**
 * Proxy Demonstration
 */

const target = {
  name: 'john',
  age: 30,
};

const handler = {
  get(target, property) {
    console.log(`Getting property ${property}`);
    return target[property];
  },

  set(target, property, value) {
    console.log(`Setting property ${property} to ${value}`);
    target[property] = value;
  },
};

const proxy = new Proxy(target, handler);

proxy.age = 31;
console.log('proxy', proxy);
