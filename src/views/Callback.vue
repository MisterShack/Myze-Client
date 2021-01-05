<template>
    <div></div>
</template>

<script>
export default {
    name: 'Callback',
    inject: ["auth"],
    created() {
        if (this.$route.query.error) {
            this.auth.logout({
                returnTo: window.location.origin + `/error?error=${encodeURI(this.$route.query.error)}&error_description=${encodeURI(this.$route.query.error_description)}`
            });
        }
    }
}
</script>