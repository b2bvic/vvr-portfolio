---
type: PageLayout
title: Home
colors: colors-a
backgroundImage:
  type: BackgroundImage
  url: /images/bg1.jpg
  backgroundSize: cover
  backgroundPosition: center
  backgroundRepeat: no-repeat
  opacity: 75
sections:
  - elementId: ''
    colors: colors-f
    backgroundSize: full
    title: >-
      Architect of Digital Systems & Scalable Growth
    subtitle: >-
      I don't just consult or manage projects; I architect and implement the comprehensive digital systems that drive scalable growth and establish market leadership. By integrating deep expertise in technical SEO, process automation, and content strategy, I solve complex business challenges with clear, systematic solutions.

      This is a selection of my work and thinking. It's designed not just to show what I've done, but to demonstrate a methodology that creates dominant, resilient, and profitable online presences.
    styles:
      self:
        height: auto
        width: wide
        margin:
          - mt-0
          - mb-0
          - ml-0
          - mr-0
        padding:
          - pt-36
          - pb-48
          - pl-4
          - pr-4
        flexDirection: row-reverse
        textAlign: left
    type: HeroSection
    actions: []
  - colors: colors-f
    type: FeaturedProjectsSection
    elementId: ''
    actions:
      - type: Link
        label: See all projects
        url: /projects
    showDate: false
    showDescription: true
    showFeaturedImage: true
    showReadMoreLink: true
    variant: variant-b
    projects:
      - content/pages/projects/grey-matter-147-clients-250k-seo-optimizations.md
      - content/pages/projects/scale-with-search-systematic-seo-solutions.md
      - content/pages/projects/found-coo-2700-percent-revenue-growth.md
    styles:
      self:
        height: auto
        width: wide
        padding:
          - pt-24
          - pb-24
          - pl-4
          - pr-4
        textAlign: left
    subtitle: Featured Projects
  - type: MetricsSection
    elementId: ''
    colors: colors-f
    title: 'Proven Results'
    subtitle: 'Systematic approaches that deliver measurable outcomes across industries and scales.'
    metrics:
      - value: 2700
        suffix: '%'
        label: 'Revenue Growth'
        description: 'FOUND annual revenue increase 2023-2024'
      - value: 250000
        suffix: '+'
        label: 'Technical Optimizations'
        description: 'SEO line items executed at Grey Matter'
      - value: 147
        label: 'Clients Managed'
        description: 'Systematic SEO strategies implemented'
      - value: 90
        suffix: '%'
        label: 'Client Acquisition Rate'
        description: 'Personal success rate at FOUND'
    styles:
      self:
        height: auto
        width: wide
        padding:
          - pt-24
          - pb-24
          - pl-4
          - pr-4
        textAlign: center
  - type: FeaturedPostsSection
    elementId: ''
    colors: colors-f
    variant: variant-d
    subtitle: Featured Posts
    showFeaturedImage: false
    actions:
      - type: Link
        label: See all posts
        url: /blog
    posts:
      - content/pages/blog/building-sops-for-seo-systematize-success-sustainable-growth.md
      - content/pages/blog/website-migrations-systematic-approach-prevents-traffic-loss.md
      - content/pages/blog/technical-seo-audit-framework-350k-case-study.md
    showDate: true
    showExcerpt: true
    showReadMoreLink: true
    styles:
      self:
        height: auto
        width: narrow
        padding:
          - pt-28
          - pb-48
          - pl-4
          - pr-4
        textAlign: left
  - type: ContactSection
    colors: colors-f
    backgroundSize: full
    title: "Let's Build Something Formidable."
    subtitle: "Have a complex challenge that requires a systematic solution? I'm interested in partnering on ambitious projects that aim for market leadership. Let's discuss the blueprint for your success."
    form:
      type: FormBlock
      elementId: sign-up-form
      fields:
        - name: firstName
          label: First Name
          hideLabel: true
          placeholder: First Name
          isRequired: true
          width: 1/2
          type: TextFormControl
        - name: lastName
          label: Last Name
          hideLabel: true
          placeholder: Last Name
          isRequired: false
          width: 1/2
          type: TextFormControl
        - name: email
          label: Email
          hideLabel: true
          placeholder: Email
          isRequired: true
          width: 1/2
          type: EmailFormControl
        - name: project
          label: Project Details
          hideLabel: true
          placeholder: Tell me about your project...
          isRequired: true
          width: full
          type: TextareaFormControl
        - name: updatesConsent
          label: Sign me up for strategic updates
          isRequired: false
          width: full
          type: CheckboxFormControl
      submitLabel: 'Initiate Contact'
      styles:
        self:
          textAlign: center
    styles:
      self:
        height: auto
        width: narrow
        margin:
          - mt-0
          - mb-0
          - ml-0
          - mr-0
        padding:
          - pt-24
          - pb-24
          - pr-4
          - pl-4
        flexDirection: row
        textAlign: left
---
