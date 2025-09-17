const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post("http://localhost:5000/api/calculate", form);
    setResult(data);
  } catch (err) {
    console.error(err);
    alert("Error calculating marks");
  }
};
