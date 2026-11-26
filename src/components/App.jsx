
import React, { useState, useEffect } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [toys, setToys] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // GET: Fetch toys when the application loads
  useEffect(() => {
    fetch("/toys")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch toys");
        }
        return response.json();
      })
      .then((data) => setToys(data))
      .catch((error) => console.error(error));
  }, []);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  // POST: Create a new toy
  function handleAddToy(newToy) {
    fetch("/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to add toy");
        return response.json();
      })
      .then((createdToy) => {
        setToys((currentToys) => [...currentToys, createdToy]);
        setShowForm(false);
      })
      .catch((error) => console.error(error));
  }

  // DELETE: Remove a toy
  function handleDeleteToy(id) {
    fetch(`/toys/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete toy");

        setToys((currentToys) =>
          currentToys.filter((toy) => toy.id !== id)
        );
      })
      .catch((error) => console.error(error));
  }

  // PATCH: Update toy likes
  function handleLikeToy(id) {
    const selectedToy = toys.find((toy) => toy.id === id);

    if (!selectedToy) return;

    const updatedLikes = selectedToy.likes + 1;

    fetch(`/toys/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likes: updatedLikes,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update likes");
        return response.json();
      })
      .then((updatedToy) => {
        setToys((currentToys) =>
          currentToys.map((toy) =>
            toy.id === id ? updatedToy : toy
          )
        );
      })
      .catch((error) => console.error(error));
  }

  return (
    <>
      <Header />

      {showForm && (
        <ToyForm onAddToy={handleAddToy} />
      )}

      <div className="buttonContainer">
        <button onClick={handleClick}>
          Add a Toy
        </button>
      </div>

      <ToyContainer
        toys={toys}
        onLikeToy={handleLikeToy}
        onDeleteToy={handleDeleteToy}
      />
    </>
  );
}

export default App;
