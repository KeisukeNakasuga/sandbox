<script lang="ts">
    // Itemデータ
    let product = {
        id: 'svelte-book',
        name: 'Svelte Book',
        price: 3500,
        images: [
            'https://github.com/svelte-book/sample-app/raw/main/static/svelte-book-1.png',
            'https://github.com/svelte-book/sample-app/raw/main/static/svelte-book-2.png',
            'https://github.com/svelte-book/sample-app/raw/main/static/svelte-book-3.png'
        ]
    };

    let relatedProducts = [
        {
            id: 'react-book',
            name: 'React Book',
            price: 3500
        },
        {
            id: 'vue-book',
            name: 'Vue Book',
            price: 3500
        },
        {
            id: 'angular-book',
            name: 'Angular Book',
            price: 3500
        }
    ];

    // ステート: カート
    let cart: string[] = [];

    function addToCart(productId: string): void {
        cart = [...cart, productId];
    }

    // 画像スライダー
    let sliderCenterIndex = 0;
    let sliderLeftIndex = product.images.length - 1;
    let sliderRightIndex = 1;

    function sliderMoveLeft(): void {
        const length = product.images.length;
        sliderCenterIndex = (sliderCenterIndex - 1 + length) % length;
        sliderLeftIndex = (sliderCenterIndex - 1 + length) % length;
        sliderRightIndex = (sliderCenterIndex + 1) % length;
    }

    function sliderMoveRight(): void {
        const length = product.images.length;
        sliderCenterIndex = (sliderCenterIndex + 1) % length;
        sliderLeftIndex = (sliderCenterIndex - 1 + length) % length;
        sliderRightIndex = (sliderCenterIndex + 1) % length;
    }
</script>

<header class="header">
    <a class="header-title">Svelte EC</a>
    <nav>
        <ul class="header-links">
            <li>ようこそゲストさん</li>
            <li>
                <a href="/cart">カート(0)</a>
            </li>
        </ul>
    </nav>
</header>

<article class="product">
    <div class="product-main">
        <div class="image-container">
            <div class="slider">
                <img src={product.images[sliderLeftIndex]} alt="スライダー画像左" class="slider-item left" />
                <img src={product.images[sliderCenterIndex]} alt="スライダー画像" class="slider-item" />
                <img src={product.images[sliderRightIndex]} alt="スライダー画像右" class="slider-item right" />
                <button class="slider-left-button" on:click={sliderMoveLeft}>←</button>
                <button class="slider-right-button" on:click={sliderMoveRight}>→</button>
            </div>
        </div>
        <div>
            <h2>{product.name}</h2>
            <dl>
                <dt>価格</dt>
                <dd>{product.price}円</dd>
            </dl>
            <div>
                {#if !cart.includes('svelte-book')}
                    <button on:click={() => addToCart('svelte-book')}>カートに入れる</button>
                {:else}
                    <button disabled>カート追加済み</button>
                {/if}
            </div>
        </div>
    </div>

    <footer>
        <h3>関連商品</h3>
        <ul>
            {#each relatedProducts as product}
                <li>
                    <a href="/products/{product.id}">{product.name}</a>
                    - {product.price}円
                </li>
            {/each}
        </ul>
    </footer>
</article>

<style>
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto;
        background-color: #fff;
        padding: 0 15px;
        width: 100%;
        max-width: 800px;
        height: 50px;
    }

    .header-title {
        font-weight: bold;
    }

    .header-links {
        display: flex;
        gap: 10px;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .product {
        margin: 0 auto;
        background-color: #fff;
        padding: 15px;
        width: 100%;
        max-width: 800px;
    }

    .product-main {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
    }

    .image-container {
        width: 100%;
        max-width: 400px;
        overflow: hidden;
    }

    .image-container img {
        width: 100%;
    }

    .slider {
        position: relative;
        width: 80%;
        margin: 0 10%;
    }

    .slider-item {
        width: 100%;
    }

    .slider-item.left {
        position: absolute;
        top: 0;
        right: 100%;
    }

    .slider-item.right {
        position: absolute;
        top: 0;
        left: 100%
    }

    .slider-left-button {
        position: absolute;
        top: 50%;
        right: 100%;
    }

    .slider-right-button {
        position: absolute;
        top: 50%;
        left: 100%;
    }
</style>