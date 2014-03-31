class ApplicationController < ActionController::Base
  protect_from_forgery

  before_filter :main_navigation

  def main_navigation
    @navigation = Navigation.main_navigation
  end
end
