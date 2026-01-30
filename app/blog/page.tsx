"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { blogPosts, blogCategories } from "@/lib/blog-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User, ArrowRight, Search, FileText } from "lucide-react";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = blogPosts.filter((post) => {
    if (!post.isPublished) return false;
    
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center">
            <FileText className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-slate-600">
          Neuigkeiten, Tipps und Wissenswertes rund um den Gerüstbau
        </p>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Artikel suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-slate-200"
              />
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <Card className="bg-white border-slate-100">
              <CardContent className="text-center py-12">
                <p className="text-slate-500 text-lg">Keine Artikel gefunden.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden bg-white border-slate-100 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 relative h-48 md:h-auto bg-slate-100">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-700">{post.category}</Badge>
                        </div>
                        <CardTitle className="text-xl text-slate-900 hover:text-slate-700 transition-colors">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.publishedAt).toLocaleDateString("de-DE")}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 mb-4">{post.excerpt}</p>
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50">
                            Weiterlesen <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="lg:w-1/4">
          <Card className="bg-white border-slate-100">
            <CardHeader>
              <CardTitle className="text-slate-900">Kategorien</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className={selectedCategory === null ? "bg-slate-900 hover:bg-slate-800" : "border-slate-200"}
                >
                  Alle
                </Button>
                {blogCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-slate-900 hover:bg-slate-800" : "border-slate-200"}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 bg-white border-slate-100">
            <CardHeader>
              <CardTitle className="text-slate-900">Beliebte Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(blogPosts.flatMap((post) => post.tags))).map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 bg-white border-slate-100">
            <CardHeader>
              <CardTitle className="text-slate-900">Kontakt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Haben Sie Fragen oder möchten Sie einen Gastbeitrag schreiben?
              </p>
              <Link href="/contact">
                <Button className="w-full bg-slate-900 hover:bg-slate-800">
                  Kontakt aufnehmen
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
