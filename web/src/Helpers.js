export function handleChange(e) {
    const { name, value } = e.target

    this.setState({
        [name]: value
    })
}

export function handleChange20(e) {
    const { name, value } = e.target
    if (value <= 20 && value >= 0)
    {
        this.setState({
            [name]: value
        })
    }
}
