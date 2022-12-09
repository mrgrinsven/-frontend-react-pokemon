import React, {useEffect, useState} from 'react';
import './App.css';

import pokemonLogo from './assets/pokemon-logo.png';
import axios from 'axios';
import Pokemon from './components/Pokemon';


function App() {
    const [page, setPage] = useState({
        next: null,
        previous: null,
    });
    const [currentPage, setCurrentPage] = useState('https://pokeapi.co/api/v2/pokemon/?limit=20')
    const [pokemonNameList, setPokemonNameList] = useState([]);

    function handlePage(e) {
        setCurrentPage(e.target.value);
    }

    useEffect(() => {
        const controllerInitial = new AbortController();
        async function getPokemonNameList() {
            try {
                const result = await axios.get(currentPage, {
                    signal: controllerInitial.signal,
                });

                setPage({
                    next: result.data.next,
                    previous: result.data.previous
                });

                setPokemonNameList(result.data.results);
            } catch (e) {
                console.error(e);
            }
        }
        getPokemonNameList();

        return function cleanup() {
            controllerInitial.abort();
        }
    }, [currentPage]);

    return (
        <>
            <header>
                <div className="image-wrapper">
                    <img src={pokemonLogo} alt="Pokemon logo"/>
                </div>
            </header>

            <main>
                <section>
                    <div className="button-container">
                        <button
                            className="navigation-button"
                            value={page.previous}
                            disabled={page.previous === null}
                            onClick={handlePage}
                        >
                            vorige
                        </button>
                        <button
                            className="navigation-button"
                            value={page.next}
                            disabled={page.next === null}
                            onClick={handlePage}
                        >
                            volgende
                        </button>
                    </div>
                </section>

                <section>
                    <div className="pokemon-container">
                        {pokemonNameList.length > 0 &&
                            <>
                                {pokemonNameList.map((pokemonName) => {
                                    return (<Pokemon name={pokemonName.name} key={pokemonName.name}/>);
                                })}
                            </>
                        }
                    </div>
                </section>
            </main>
        </>
    );
}

export default App;
