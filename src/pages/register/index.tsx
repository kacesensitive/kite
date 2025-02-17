import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import store from 'store';
import agent from "../../Agent";
import KiteLogo from '../../assets/kite.png';
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";

export default function Register(props: {}) {
    const [form, setForm] = useState({
        email: '',
        password: '',
        handle: '',
        inviteCode: '',
        service: '',
        loading: false,
        error: null
    });
    const theme = store.get("theme");
    const navigate = useNavigate();
    const [advanced, setAdvanced] = useState(false);

    useEffect(() => {
        if (theme == 'dark') {
            document.body.classList.add('dark');
        }
    }, []);

    const _handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!form.email.length || !form.password.length) return;
        setForm(prev => ({ ...prev, loading: true }));
        try {
            if (form.service.length) {
                if (!form.service.startsWith('https://')) {
                    // @ts-ignore
                    setForm(prev => ({ ...prev, error: "Service Url is not valid" }));
                    return;
                }
                // @ts-ignore
                agent.changeService(form.service);
            }
            const result = await agent.createAccount({
                // identifier: form.identifier.includes(".") ? form.identifier : `${form.identifier}.bsky.social`,
                email: form.email,
                password: form.password,
                handle: form.handle,
                inviteCode: form.inviteCode
            });
            if (result.success) {
                navigate("/");
            }

        } catch (err: any) {
            console.error(err.message);
            setForm(prev => ({ ...prev, error: err.message, loading: false }));
        }
    }

    return (
        <div className="login-page">
            <div className="d-flex w-100 justify-content-start text-left">
                <BackButton/>
            </div>
            <img src={KiteLogo} alt="Kite | A Better BlueSky Client" />
            <h1>Kite</h1>
            <h2>Better BlueSky Client</h2>
            <form onSubmit={_handleSubmit}>
                <div className="input-wrapper">
                    <input type="text" placeholder="Invite Code" value={form.inviteCode} onChange={e => setForm(prev => ({ ...prev, inviteCode: e.target.value }))} />
                </div>
                {!form.inviteCode.length ? '' :
                    <>
                        <div className="input-wrapper">
                            <input type="text" placeholder="Handle ( it's like username )" value={form.handle} onChange={e => setForm(prev => ({ ...prev, handle: e.target.value }))} />
                        </div>
                        <div className="input-wrapper">
                            <input type="email" placeholder="Email address" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} />
                        </div>
                        <div className="input-wrapper">
                            <input type="password" placeholder="Password" value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} />
                        </div>

                        {advanced ?
                            <div className="input-wrapper">
                                <input type="text" placeholder="Service URL, Leave empty if you don't know what this is" value={form.service} onChange={e => setForm(prev => ({ ...prev, service: e.target.value }))} />
                            </div>
                            :
                            <strong style={{ display: 'block', marginBottom: '2rem' }} className="text-grey pointer" onClick={() => setAdvanced(true)}>+ Advanced</strong>
                        }
                        <Button text="Create Account" className="btn" loading={form.loading} />
                        {form.error ? <p className="error text-center">{form.error}</p> : ''}
                    </>}
            </form>
        </div>
    );
}