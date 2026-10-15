  import { useState } from 'react';

  function Register() {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
    });

    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
      event.preventDefault();

      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || 'Unable to create account.');
        }

        console.log('Registration success', data);
        alert('Registration complete!');
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    };

    return (
      <section className="register-shell">
        <h2>Create account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" required />
          <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" required />
          <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
          <button type="submit">Create account</button>
        </form>
      </section>
    );
  }

  export default Register;
