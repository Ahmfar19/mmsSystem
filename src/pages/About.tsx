import { Component, createSignal, onMount } from 'solid-js';
// import { Title } from '@solidjs/meta';

// @ts-ignore
// import init from "../assets/js/main"

const [filterId, setFilterId] = createSignal();

const Blog: Component = () => {
    onMount(() => {
        // init();
    });

    return (
        <>
            <section id='blog.sidebar.categories' class='blog'>
                <div class='container' data-aos='fade-up'>
                    <section id='about' class='about'>
                        <div class='container'>
                            <h2>About</h2>
                        </div>
                    </section>
                </div>
            </section>
        </>
    );
};

export default Blog;
export { filterId, setFilterId };
