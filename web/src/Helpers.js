export function handleChange(e) {
    const { name, value } = e.target

    this.setState({
        [name]: value
    })
}

export function handleChange20(e) {
    const { name, value } = e.target
    if (value.match(/^([0-1]?[0-9]|20|^$)$/))
    {
        this.setState({
            [name]: value
        })
    }
}
