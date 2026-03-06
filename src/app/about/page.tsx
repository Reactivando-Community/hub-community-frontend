'use client';

import {
  Github,
  Heart,
  Instagram,
  Linkedin,
  Mail,
  Target,
  Twitter,
  Users,
  Zap,
} from 'lucide-react';
import Image from 'next/image';

import { AnimateOnScroll, FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <FadeIn direction="up" delay={0}>
            <h1 className="text-5xl font-bold mb-6">Sobre o Hub Community</h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Nossa missão é conectar desenvolvedores e comunidades de tecnologia
              em todo o Brasil, facilitando o acesso ao conhecimento e promovendo
              o networking entre profissionais da área.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Mission Section */}
        <AnimateOnScroll>
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Nossa História
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                O HubCommunity nasceu da necessidade de centralizar informações
                sobre comunidades e eventos de tecnologia em Goiás. Percebemos
                que muitas pessoas talentosas estavam perdendo oportunidades
                incríveis de aprendizado e networking simplesmente porque não
                sabiam onde encontrar essas informações.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Desde 2013, já conectamos diversas pessoas com suas comunidades
                ideais, facilitando o acesso a diversos eventos em Goiás.
              </p>
              {/* <Button size="lg">Junte-se a Nós</Button> */}
            </div>
            <div className="relative">
              <Image
                src="/images/hero-background.png"
                alt="Equipe HubCommunity"
                width={800}
                height={320}
                className="rounded-lg shadow-lg w-full h-80 object-cover"
                unoptimized
              />
            </div>
          </div>
        </section>
        </AnimateOnScroll>

        {/* Values Section */}
        <AnimateOnScroll>
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Nossos Valores
          </h2>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StaggerItem>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Comunidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Acreditamos no poder da colaboração e do compartilhamento de
                  conhecimento.
                </p>
              </CardContent>
            </Card>
            </StaggerItem>

            <StaggerItem>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Foco</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mantemos o foco em conectar pessoas com as oportunidades
                  certas.
                </p>
              </CardContent>
            </Card>
            </StaggerItem>

            <StaggerItem>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Paixão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Somos apaixonados por tecnologia e pelo crescimento da
                  comunidade tech.
                </p>
              </CardContent>
            </Card>
            </StaggerItem>

            <StaggerItem>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Inovação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Buscamos sempre novas formas de melhorar a experiência dos
                  usuários.
                </p>
              </CardContent>
            </Card>
            </StaggerItem>
          </StaggerContainer>
        </section>
        </AnimateOnScroll>

        {/* Stats Section */}
        <AnimateOnScroll>
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-center mb-12">
                Nosso Impacto
              </h2>
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <StaggerItem>
                <div>
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <div className="text-lg opacity-90">
                    Comunidades Cadastradas
                  </div>
                </div>
                </StaggerItem>
                <StaggerItem>
                <div>
                  <div className="text-4xl font-bold mb-2">10K+</div>
                  <div className="text-lg opacity-90">
                    Desenvolvedores Conectados
                  </div>
                </div>
                </StaggerItem>
                <StaggerItem>
                <div>
                  <div className="text-4xl font-bold mb-2">1K+</div>
                  <div className="text-lg opacity-90">Eventos Realizados</div>
                </div>
                </StaggerItem>
                <StaggerItem>
                <div>
                  <div className="text-4xl font-bold mb-2">50+</div>
                  <div className="text-lg opacity-90">Cidades Atendidas</div>
                </div>
                </StaggerItem>
              </StaggerContainer>
            </CardContent>
          </Card>
        </section>
        </AnimateOnScroll>

        {/* Team Section */}
        <AnimateOnScroll>
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Nossa Equipe
          </h2>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Image
                  src="https://hubcommunity-manager.8020digital.com.br/uploads/1730223158826_1b30749fc2.jpeg"
                  alt="Pedro Goiânia"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  unoptimized
                />
                <h3 className="text-xl font-semibold mb-2">Pedro Goiânia</h3>
                <p className="text-primary mb-2">Co-Fundador</p>
                <p className="text-muted-foreground text-sm mb-4">
                  JavaScript Jedi com 10+ anos de experiência de desenvolvimento
                  e em comunidades tech.
                </p>
                <div className="flex justify-center space-x-3">
                  <a
                    href="http://github.com/pedrogoiania"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                  </a>
                  <a
                    href="http://x.com/opedrogoiania"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                  </a>
                  <a
                    href="http://linkedin.com/in/pedrogoiania"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                  </a>
                </div>
              </CardContent>
            </Card>
            </StaggerItem>

            <StaggerItem>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Image
                  src="http://github.com/fjrleao.png"
                  alt="Fábio Leão Júnior"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  unoptimized
                />
                <h3 className="text-xl font-semibold mb-2">
                  Fábio Leão Júnior
                </h3>
                <p className="text-primary mb-2">Co-Fundador</p>
                <p className="text-muted-foreground text-sm mb-4">
                  Desenvolvedor Full Stack com foco em React e Python,
                  apaixonado por criar soluções inovadoras com mais de 6 anos de
                  experiência. Líder de comunidade há 2 anos.
                </p>
                <div className="flex justify-center space-x-3">
                  <a
                    href="http://github.com/fjrleao"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                  </a>
                  <a
                    href="http://linkedin.com/in/fjrleao"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                  </a>
                </div>
              </CardContent>
            </Card>
            </StaggerItem>

            <StaggerItem>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Image
                  src="https://hubcommunity-manager.8020digital.com.br/uploads/1740619175287_b13423c1ca.jpeg"
                  alt="Marcus Vinícius"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  unoptimized
                />
                <h3 className="text-xl font-semibold mb-2">Marcus Vinícius</h3>
                <p className="text-primary mb-2">Co-Fundador</p>
                <p className="text-muted-foreground text-sm mb-4">
                  Desenvolvedor de Software com 7+ anos de experiência,
                  especialista no ecossistema React e React Native.
                </p>
                <div className="flex justify-center space-x-3">
                  <div className="flex justify-center space-x-3">
                    <a
                      href="http://github.com/mvmmarcus"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </a>
                    <a
                      href="http://linkedin.com/in/mvmmarcus"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            </StaggerItem>

            <StaggerItem>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Image
                  src="https://github.com/luk3skyw4lker.png"
                  alt="Lucas Lemos"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  unoptimized
                />
                <h3 className="text-xl font-semibold mb-2">Lucas Lemos</h3>
                <p className="text-primary mb-2">Co-Fundador</p>
                <p className="text-muted-foreground text-sm mb-4">
                  Engenheiro de Software com 8 anos de experiência, especialista
                  em desenvolvimento backend com Golang e Node.js, contribuidor
                  open-source e voluntário em comunidades de tecnologia.
                </p>
                <div className="flex justify-center space-x-3">
                  <div className="flex justify-center space-x-3">
                    <a
                      href="http://github.com/luk3skyw4lker"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </a>
                    <a
                      href="http://linkedin.com/in/lucashenriqueblemos"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            </StaggerItem>
          </StaggerContainer>
        </section>
        </AnimateOnScroll>

        {/* Contact Section */}
        <AnimateOnScroll>
        <section>
          <Card className="bg-muted">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Entre em Contato
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Tem alguma dúvida, sugestão ou quer fazer parte da nossa equipe?
                Adoraríamos ouvir de você!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="flex items-center gap-2"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.open('mailto:contato@8020digital.com.br');
                    }
                  }}
                >
                  <Mail className="h-4 w-4" />
                  Enviar Email
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.open(
                        'https://instagram.com/joincommunity',
                        '_blank'
                      );
                    }
                  }}
                >
                  <Instagram className="h-4 w-4" />
                  Seguir no Instagram
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
        </AnimateOnScroll>
      </div>
    </div>
  );
}
