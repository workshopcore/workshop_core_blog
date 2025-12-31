.PHONY: serve cli help install

# Default target
help:
	@echo "Instagram Visual Generator Tool"
	@echo ""
	@echo "Usage:"
	@echo "  make serve              Start the browser-based editor (http://localhost:8080)"
	@echo "  make install            Install CLI dependencies"
	@echo "  make cli INPUT=<path>   Generate images from JSON file"
	@echo ""
	@echo "Examples:"
	@echo "  make serve"
	@echo "  make cli INPUT=posts/example_post_1/post.json"
	@echo "  make cli INPUT=posts/example_post_1/post.json OUTPUT=posts/example_post_1/output/"

# Start the web server for the browser editor
serve:
	@echo "Starting visual generator editor at http://localhost:8080/tool/"
	@echo "Press Ctrl+C to stop"
	@python3 -m http.server 8080

# Install CLI dependencies
install:
	@echo "Installing CLI dependencies..."
	@cd tool && npm install

# Generate images via CLI
cli:
ifndef INPUT
	$(error INPUT is required. Usage: make cli INPUT=posts/example_post_1/post.json)
endif
	@node tool/cli.js --input "$(INPUT)" --base . $(if $(OUTPUT),--output "$(OUTPUT)",)
