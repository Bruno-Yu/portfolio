/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Card, Label, TextInput, Alert } from 'flowbite-react';
import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/store/auth-hook';
import { getImageUrl } from '@/utils/index';
import { getBaseUrl } from '@/config';

const SignInPage: FC = function () {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const baseUrl = getBaseUrl()
  const from = location.state?.from?.pathname || `${baseUrl}contents`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || '登入失敗');
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center pt-24 xl:pt-36 px-6 lg:h-screen lg:gap-y-12">
      <Card
        horizontal
        imgSrc={getImageUrl('article-image6')}
        imgAlt=""
        className="w-[80%] max-w-[1000px] md:max-w-screen [&>img]:hidden md:[&>img]:w-80 md:[&>img]:p-0 md:[&>*]:w-full md:[&>*]:p-16 lg:[&>img]:block"
      >
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          登入
        </h1>

        {error && (
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="username">帳號</Label>
            <TextInput
              id="username"
              name="username"
              placeholder="請輸入帳號"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="password">密碼</Label>
            <TextInput
              id="password"
              name="password"
              placeholder="請輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>
          <div className="mb-6 border">
            <Button
              type="submit"
              className="w-full bg-slate-950"
              disabled={loading}
            >
              {loading ? '登入中...' : '登入'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SignInPage;
