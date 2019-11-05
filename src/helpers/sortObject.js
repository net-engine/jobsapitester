const sortObject = (obj, key) => obj.sort((a, b) => (a[key] > b[key]) ? 1 : -1);

export default sortObject;