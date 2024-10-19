<script>
    let count = 0;
</script>

<div>
    <p>クリックした回数：{count}</p>
    <button on:click={() => count += 1}>+ボタン</button>
    <button on:click={() => count -= 1}>-ボタン</button>
</div>