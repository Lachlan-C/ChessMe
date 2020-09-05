export function handleChange(e) {
    const { name, value } = e.target

    this.setState({
        [name]: value
    })
}
