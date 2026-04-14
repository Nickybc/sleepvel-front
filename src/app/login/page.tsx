'use client';

import { Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { BrandHeader } from '@/components/BrandHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!userId.trim() || !password.trim()) {
      setError('请输入用户ID和密码');
      return;
    }

    setIsLoading(true);
    
    // 模拟登录验证 - 实际项目中应该调用后端API
    try {
      // TODO: 替换为实际的登录API调用
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 登录成功后跳转到报告页面
      router.push('/report');
    } catch {
      setError('登录失败，请检查用户ID和密码');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部装饰条 */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-primary/70 to-primary/40" />
      
      <div className="flex min-h-[calc(100vh-6px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* 品牌头部 */}
          <BrandHeader className="mb-10" />

          {/* 登录卡片 */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg shadow-primary/5">
            {/* 标题区域 */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">用户登录</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                请输入您的账号信息
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* 用户ID */}
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-sm font-medium text-foreground">
                  用户ID
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="userId"
                    type="text"
                    value={userId}
                    placeholder="请输入用户ID"
                    onChange={e => setUserId(e.target.value)}
                    className="h-12 pl-10 bg-background text-base transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* 密码 */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  密码
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    placeholder="请输入密码"
                    onChange={e => setPassword(e.target.value)}
                    className="h-12 pl-10 bg-background text-base transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* 错误提示 */}
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              {/* 登录按钮 */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full h-14 text-base font-medium shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30"
              >
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </form>
          </div>

          {/* 底部说明 */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            齐鲁医院睡眠科 - 智慧诊疗系统
          </p>
        </div>
      </div>
    </div>
  );
}
