import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Pokemon = ({name}) => {
    const [pokemonInfo, setPokemonInfo] = useState({});
    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        async function getPokemonData() {
            toggleLoading(true);
            try {
                toggleError(false);
                const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`, {
                    signal: controller.signal,
                });
                setPokemonInfo(result);
            } catch (e) {
                console.error(e);
                toggleError(true);
            }
        }
        getPokemonData();
        toggleLoading(false);

         return function cleanup() {
             controller.abort();
         }
    }, [name]);

    return (
        <div className="pokemon">
            {loading && <span>Loading...</span>}
            {error && <span>Er is iets misgegaan met het ophalen van de data</span>}
            {Object.keys(pokemonInfo).length > 0 &&
                <>
                    <p className="pokemon-name">{pokemonInfo.data.name}</p>
                    <img src={pokemonInfo.data.sprites.front_default} alt={pokemonInfo.data.name}/>
                    <p><strong>Moves: </strong>{pokemonInfo.data.moves.length}</p>
                    <p><strong>Weight: </strong>{pokemonInfo.data.weight}</p>
                    <p><strong>Abilities: </strong></p>
                    {pokemonInfo.data.abilities.map((abilitySet) => {
                        return (<p className="pokemon-abilities" key={abilitySet.ability.name}>{abilitySet.ability.name}</p>)
                    })}
                </>
            }
        </div>
    );
};

export default Pokemon;