<script>
  export default {
    name: 'authredirect',
    created() {
      const hash = window.location.search.slice(1)
      window.opener.location.href = window.location.origin + '/login#' + hash
      // console.log(window.opener.location.href, '-----')
      window.close()
    }
  }
</script>
