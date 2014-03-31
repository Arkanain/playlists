module ApplicationHelper
  def page_nav
    controller = params[:controller]
    render partial: "navigation/#{controller}_nav" rescue nil
  end
end